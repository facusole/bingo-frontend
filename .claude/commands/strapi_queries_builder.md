---
name: generating-strapi-queries
description: How to implement queries from strapi JSON schemas using qs in the frontend, following a specific pattern
applyIntelligently: true
---

# Strapi Query Building Rules

This skill defines rules for building Strapi REST API queries that integrate with the frontend. Claude Code should follow these patterns when creating or modifying queries.

**Note:** This guide is for **Strapi v5.x**. Query syntax differs significantly from v3/v4. For this to work, user should have both strapi and web repositories open in the same context window, if not found either of those, ask the user to provide it.

## Project Structure

### Strapi (Backend)

- **Content type schemas**: `src/api/[content-type]/content-types/[name]/schema.json`
- **Component schemas**: `src/components/[category]/[component].json`

### Frontend

- **Queries**: `src/features/services/queries/[content-type].query.ts`
- **Services**: `src/features/services/get-[content-type].ts`
- **Types**: `src/data/strapi/[content-type]/[content-type].strapi.types.ts`

### Pattern Overview

```
src/
  features/
    venues/
      services/
        queries/
          venues.query.ts      # Query definitions using qs
        get-venues.ts          # Service functions that call Strapi
        venues.types.ts        # Response types
  common/
    services/
      strapi-client.ts       # Strapi client setup
```

## Query Building Rules

### Rule 1: Dynamic Zones MUST use the `on` directive

**⚠️ NEVER use `populate: '*'` for dynamic zones. ALWAYS use the `on:` directive.**

When a schema has `"type": "dynamiczone"`, you MUST:

1. Read the schema to find ALL components in the `"components"` array
2. Create an `on:` block with an entry for EVERY component
3. Specify fields and nested populations for each component individually

```typescript
// Schema defines:
"content": {
  "type": "dynamiczone",
  "components": ["blocks.text", "blocks.image", "blocks.video"]
}

// ❌ WRONG - Never do this for dynamic zones:
content: { populate: '*' }

// ✅ CORRECT - Must have entry for EACH component:
content: {
  on: {
    'blocks.text': { populate: { fields: ['body'] } },
    'blocks.image': { populate: { image: { fields: ['url'] } } },
    'blocks.video': { populate: { fields: ['videoUrl', 'caption'] } }
  }
}
```

**If you find yourself writing `populate: '*'` for a dynamic zone, STOP and go read the component schemas.**

### Rule 2: Component naming convention

Components are referenced as `category.component-name`:

- Schema file: `src/components/blocks/text.json`
- Query key: `'blocks.text'`

### Rule 3: Field selection

Only request fields needed by the frontend. Use `fields` array:

```typescript
// BAD - fetches everything
article: { populate: '*' }

// GOOD - explicit fields
article: {
  fields: ['title', 'slug', 'publishedAt'],
  populate: { /* nested relations */ }
}
```

**Exception:** Use `populate: '*'` only for components with unknown or highly dynamic structures (e.g., third-party integrations, JSON fields).

### Rule 4: Media fields

For media/image fields, always specify which properties are needed:

```typescript
// Basic - just URL
thumbnail: {
  fields: ['url'];
}

// Responsive images
thumbnail: {
  fields: ['url', 'formats', 'alternativeText'];
}
```

### Rule 5: Relations

For relation fields, specify both `fields` and nested `populate`:

```typescript
// One-to-one or many-to-one
author: {
  fields: ['name', 'email']
}

// With nested relations
category: {
  fields: ['name', 'slug'],
  populate: {
    parent: {
      fields: ['name', 'slug']
    }
  }
}
```

### Rule 6: Repeatable components

For `"repeatable": true` components, query the component name directly:

```typescript
// Schema: "items" is repeatable component
"items": {
  "type": "component",
  "component": "shared.link-item",
  "repeatable": true
}

// Query:
items: {
  populate: {
    fields: ['label', 'url'],
    icon: {
      fields: ['url']
    }
  }
}
```

### Rule 7: Only query content types (collections or single-types)

Components don't have their own API endpoints - they're always embedded inside a content type.

**Key points:**

- **Collections** (`src/api/[name]/...`) → Have endpoints like `/api/articles`
- **Single-types** (`src/api/[name]/...`) → Have endpoints like `/api/homepage`
- **Components** (`src/components/...`) → No endpoint, always nested inside a content type

When populating a component inside a content type:

- **Scalar fields** (string, text, boolean, etc.) come automatically
- **Only use `populate`** for relations, media, or nested components inside the component

```typescript
// Schema: Page (single-type) has a featuredArticle component
// featuredArticle has: tag (string), description (text), article (relation)

export const queryPage = (locale = 'en') =>
  qs.stringify({
    fields: ['title', 'slug'], // Page's own fields
    populate: {
      featuredArticle: {
        // tag and description come automatically!
        populate: {
          // Only need populate for the relation
          article: {
            fields: ['title', 'slug', 'publishedAt'],
          },
        },
      },
    },
  }) + `&locale=${locale}`;
```

### Rule 8: Filters, Sorting, and Pagination

Include these parameters when needed:

```typescript
// Filters
filters: {
  slug: { $eq: 'my-article' },
  publishedAt: { $notNull: true },
  category: {
    slug: { $eq: 'news' }
  }
}

// Sorting
sort: ['publishedAt:desc', 'title:asc']

// Pagination
pagination: {
  page: 1,
  pageSize: 10
}

// Publication state (draft vs published)
publicationState: 'live'  // or 'preview' for drafts
```

## Service Function Pattern

Queries are consumed by service functions that call the Strapi client:

```typescript
// src/features/services/get-venues.ts
import { getStrapiData } from '@/common/services/strapi-client';
import { VenuesListResponse, VenuesResponse } from '@/data/strapi/venues/venues.strapi.types';

import { venueDetailQuery, venuesQuery } from './queries/venues.query';

// List query - no parameters
export const getVenues = async () => {
  const venues = await getStrapiData<VenuesListResponse[]>('venues', venuesQuery);
  return venues;
};

// Detail query - with slug filter
export const getVenueDetail = async (slug: string) => {
  const venue = await getStrapiData<VenuesResponse[]>('venues', venueDetailQuery(slug));
  return { data: venue.data[0], meta: venue.meta };
};
```

**Key patterns:**

- Service functions are named `get[ContentType]` or `get[ContentType]Detail`
- List queries return array, detail queries return single item (`data[0]`)
- Query functions can accept parameters (like `slug`) for filters
- Types are imported from `src/data/strapi/[content-type]/`

## Common Query Fragments

Define reusable patterns for your project. Examples:

```typescript
// Reusable media query
const imageQuery = {
  fields: ['url', 'formats', 'alternativeText'],
};

// Reusable SEO component
const seoQuery = {
  populate: {
    fields: ['metaTitle', 'metaDescription'],
    metaImage: imageQuery,
  },
};

// Reusable author relation
const authorQuery = {
  fields: ['name', 'slug'],
  populate: {
    avatar: { fields: ['url'] },
  },
};
```

## Complete Query Example

Real-world example with annotations:

```typescript
import qs from 'qs';

export const queryArticles = (locale = 'en') =>
  `${qs.stringify({
    // Rule 3: Explicit fields only
    fields: ['title', 'slug', 'excerpt', 'publishedAt'],

    // Rule 8: Filters for published content
    filters: {
      publishedAt: { $notNull: true },
    },

    // Rule 8: Sorting
    sort: ['publishedAt:desc'],

    // Rule 8: Pagination
    pagination: {
      page: 1,
      pageSize: 10,
    },

    populate: {
      // Rule 4: Media fields
      thumbnail: { fields: ['url', 'formats'] },

      // Rule 5: Relations with nested populate
      author: {
        fields: ['name', 'slug'],
        populate: {
          avatar: { fields: ['url'] },
        },
      },

      // Rule 5: Nested relation
      category: {
        fields: ['name', 'slug'],
      },

      // Rule 1: Dynamic zone with 'on' directive
      content: {
        on: {
          'blocks.rich-text': {
            populate: { fields: ['body'] },
          },
          'blocks.image': {
            populate: {
              fields: ['caption'],
              image: { fields: ['url', 'formats'] },
            },
          },
          'blocks.quote': {
            populate: { fields: ['text', 'author'] },
          },
        },
      },

      // SEO component
      seo: {
        populate: '*',
      },
    },
  })}&locale=${locale}&publicationState=live`;
```

## Schema to Query Mapping

When reading a schema JSON, map types to query patterns:

| Schema Type             | Query Pattern                                                  |
| ----------------------- | -------------------------------------------------------------- |
| `"type": "string"`      | Include in `fields` array                                      |
| `"type": "text"`        | Include in `fields` array                                      |
| `"type": "richtext"`    | Include in `fields` array                                      |
| `"type": "integer"`     | Include in `fields` array                                      |
| `"type": "decimal"`     | Include in `fields` array                                      |
| `"type": "boolean"`     | Include in `fields` array                                      |
| `"type": "date"`        | Include in `fields` array                                      |
| `"type": "datetime"`    | Include in `fields` array                                      |
| `"type": "enumeration"` | Include in `fields` array                                      |
| `"type": "uid"`         | Include in `fields` array (usually `slug`)                     |
| `"type": "blocks"`      | Include in `fields` array (Strapi v5 block editor)             |
| `"type": "json"`        | Include in `fields` array                                      |
| `"type": "media"`       | Use `populate` with `fields: ['url']` or `['url', 'formats']`  |
| `"type": "relation"`    | Use `populate` with `fields` + nested `populate` for relations |
| `"type": "component"`   | Use `populate`, check if `repeatable`                          |
| `"type": "dynamiczone"` | Use `on` directive with each component listed                  |
| `"type": "customField"` | Usually `populate: '*'` or check plugin docs                   |

## Common Pitfalls to Avoid

❌ **Don't skip reading schemas** - NEVER write a query without first reading the actual schema.json files
❌ **Don't use populate: '\*' for dynamic zones** - ALWAYS use `on:` directive with explicit component entries
❌ **Don't forget locale parameter** - Always append `&locale=${locale}`
❌ **Don't over-populate** - Limit relation depth to 2-3 levels max
❌ **Don't use populate: '\*' everywhere** - Explicit fields only (with documented exceptions)
❌ **Don't forget publicationState** - Default behavior may include drafts
❌ **Don't nest too deeply** - Strapi has URL length limits for GET requests
❌ **Don't assume schema structure** - Even if you think you know it, read the file to confirm

✅ **Do read ALL schema files first** - Content-type schema AND every component schema
✅ **Do reuse query fragments** - Define common patterns once, reuse everywhere
✅ **Do limit relation depth** - Maximum 3 levels deep for performance
✅ **Do read the schema first** - Always check the schema.json before building queries
✅ **Do document exceptions** - Comment any `populate: '*'` usage

## Error Handling & Edge Cases

When building queries, handle these scenarios:

1. **Missing schema file** → Check alternative paths, ask user for file location
2. **Circular relations** → Limit depth to 2-3 levels, document the limitation
3. **Unknown component** → Use `populate: '*'` as fallback, add comment explaining why
4. **Large response** → Consider pagination or splitting into multiple queries
5. **URL too long** → Switch to POST request with `_method=GET` or split query

## Workflow for Claude Code

When user asks to create/update a Strapi query:

### Step 1: Read ALL schemas (MANDATORY - DO NOT SKIP)

**⚠️ CRITICAL: You MUST read the schema files before writing ANY query code. Do not rely on memory or assumptions.**

1. **Read the content type schema** at `src/api/[name]/content-types/[name]/schema.json`
   - If not found, check common alternative paths or ask user
   - **Actually open and read the file** - do not assume you know the structure

2. **For EVERY dynamic zone in the schema**, read ALL component schemas:
   - Dynamic zones list their components in `"components": ["category.name", ...]`
   - Read EACH component at `src/components/[category]/[name].json`
   - **Do not skip any component** - each needs its own `on:` block in the query

3. **For each component, recursively read nested components/relations**:
   - If a component has relations → read those content-type schemas
   - If a component has nested components → read those component schemas
   - Build the full dependency tree by actually reading files

4. **Identify all relations & components** → Build dependency tree
   - Note which are repeatable, required, etc.

5. **Check for circular references** → Plan depth limits (max 3 levels)

**Example: If schema has `"Page": { "type": "dynamiczone", "components": ["home.hero-home", "cover-video.cover-video", ...] }`**

- You MUST read: `src/components/home/hero-home.json`
- You MUST read: `src/components/cover-video/cover-video.json`
- And so on for EVERY component listed

### Step 2: Create the query file

Location: `src/features/services/queries/[content-type].query.ts`

1. **Apply query rules** → Use Rules 1-8 systematically
   - Dynamic zones → Rule 1 (`on` directive)
   - Components → Rule 2 (naming) + Rule 6 (repeatable) + Rule 7 (nested in content types)
   - Fields → Rule 3 (explicit selection)
   - Media → Rule 4 (url/formats)
   - Relations → Rule 5 (nested populate)
   - Filters/Sort/Pagination → Rule 8

2. **Create reusable fragments** → Extract common patterns (like `tagQuery`)

3. **Export queries** → One for list, one for detail (if needed)

### Step 3: Create the service file

Location: `src/features/services/get-[content-type].ts`

1. **Import dependencies** → getStrapiData, types, queries
2. **Create service functions** → `get[ContentType]()` and `get[ContentType]Detail(slug)`
3. **Handle response** → List returns array, detail returns `data[0]`

### Step 4: Create types (if needed)

Location: `src/data/strapi/[content-type]/[content-type].strapi.types.ts`

Define TypeScript interfaces that match the query response structure.
