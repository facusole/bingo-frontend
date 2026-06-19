'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useId, type ReactNode } from 'react';

import { Icon } from '@/common/ui/icon/icon';

type Side = 'top' | 'right';

interface Props {
  open: boolean;
  onClose: () => void;
  side?: Side;
  title?: ReactNode;
  /** Optional aria-label override. Defaults to `title` when present. */
  ariaLabel?: string;
  children: ReactNode;
}

/**
 * Drawer — shared, animated overlay panel.
 *
 * Reused for the mobile hamburger menu, history-board drawer, and players
 * drawer. The `side` prop chooses entry direction (top or right). Backdrop
 * click + Escape close. Body scroll is locked while open. Honors
 * `prefers-reduced-motion`.
 */
export function Drawer({ open, onClose, side = 'top', title, ariaLabel, children }: Props) {
  const tCommon = useTranslations('common');
  const titleId = useId();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const panelInitial = reduced
    ? { opacity: 0 }
    : side === 'top'
      ? { y: '-100%', opacity: 0 }
      : { x: '100%', opacity: 0 };
  const panelAnimate = reduced ? { opacity: 1 } : { x: 0, y: 0, opacity: 1 };
  const panelExit = panelInitial;
  const tween = {
    type: 'tween' as const,
    ease: [0.2, 0.85, 0.3, 1] as [number, number, number, number],
    duration: reduced ? 0 : 0.28,
  };

  const panelClasses =
    side === 'top'
      ? 'fixed inset-x-0 top-0 mx-auto max-w-[680px] rounded-b-3xl bg-surface shadow-bingo-lg'
      : 'fixed inset-y-0 right-0 w-[min(360px,90vw)] rounded-l-3xl bg-surface shadow-bingo-lg';

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="backdrop"
            animate={{ opacity: 1 }}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-ink/55 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            onClick={onClose}
          />
          <motion.div
            key="panel"
            animate={panelAnimate}
            aria-label={ariaLabel ?? (typeof title === 'string' ? title : undefined)}
            aria-labelledby={title ? titleId : undefined}
            aria-modal="true"
            className={`z-50 flex flex-col p-5 ${panelClasses}`}
            exit={panelExit}
            initial={panelInitial}
            role="dialog"
            transition={tween}
          >
            <header className="mb-4 flex items-center justify-between gap-3">
              <span
                className="font-display text-ink text-lg font-semibold tracking-tight"
                id={titleId}
              >
                {title}
              </span>
              <button
                aria-label={tCommon('close')}
                className="border-line hover:bg-paper grid h-9 w-9 cursor-pointer place-items-center rounded-full border transition-colors"
                type="button"
                onClick={onClose}
              >
                <Icon color="var(--ink)" name="close" size={18} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
