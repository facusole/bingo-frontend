'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { Panel } from '@/common/ui/panel/panel';
import type { Prize } from '@/features/bingo/utils/protocol';

interface Props {
  linePrize: Prize;
  bingoPrize: Prize;
  /** Called when either prize changes; debounced to avoid one socket frame per keystroke. */
  onChange: (line: Prize, bingo: Prize) => void;
}

const DEBOUNCE_MS = 400;

/** Admin-only editor for the line/bingo prize. Allowed in idle and finished
 *  state; the backend rejects updates during active play. */
export function PrizeEditor({ linePrize, bingoPrize, onChange }: Props) {
  const t = useTranslations('prizes');
  const [draftLine, setDraftLine] = useState<Prize>(linePrize);
  const [draftBingo, setDraftBingo] = useState<Prize>(bingoPrize);
  const lastSyncedRef = useRef({ line: linePrize, bingo: bingoPrize });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-sync drafts when the source of truth changes from outside (e.g. a
  // prizes_updated broadcast from another admin tab, or initial snapshot).
  useEffect(() => {
    setDraftLine(linePrize);
    lastSyncedRef.current.line = linePrize;
  }, [linePrize]);
  useEffect(() => {
    setDraftBingo(bingoPrize);
    lastSyncedRef.current.bingo = bingoPrize;
  }, [bingoPrize]);

  useEffect(() => {
    if (
      draftLine.enabled === lastSyncedRef.current.line.enabled &&
      draftLine.name === lastSyncedRef.current.line.name &&
      draftBingo.enabled === lastSyncedRef.current.bingo.enabled &&
      draftBingo.name === lastSyncedRef.current.bingo.name
    ) {
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      lastSyncedRef.current = { line: draftLine, bingo: draftBingo };
      onChange(draftLine, draftBingo);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [draftLine, draftBingo, onChange]);

  return (
    <Panel icon="crown" title={t('title')}>
      <div className="flex flex-col gap-4">
        <PrizeRow
          label={t('lineLabel')}
          placeholder={t('placeholder')}
          value={draftLine}
          onChange={setDraftLine}
        />
        <PrizeRow
          label={t('bingoLabel')}
          placeholder={t('placeholder')}
          value={draftBingo}
          onChange={setDraftBingo}
        />
      </div>
    </Panel>
  );
}

interface RowProps {
  label: string;
  placeholder: string;
  value: Prize;
  onChange: (next: Prize) => void;
}

function PrizeRow({ label, placeholder, value, onChange }: RowProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-ink text-[14px] font-semibold">{label}</span>
        <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium">
          <input
            checked={value.enabled}
            className="accent-[var(--primary)]"
            type="checkbox"
            onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
          />
          <span className="text-muted">{value.enabled ? '✓' : '—'}</span>
        </label>
      </div>
      <input
        className="border-line bg-paper text-ink focus:border-primary disabled:bg-paper/50 disabled:text-muted rounded-lg border px-3 py-2 text-[14px] outline-none transition-colors"
        disabled={!value.enabled}
        placeholder={placeholder}
        type="text"
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
      />
    </div>
  );
}
