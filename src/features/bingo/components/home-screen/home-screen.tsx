'use client';

import { useState, useTransition } from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/common/ui/button/button';
import { useRouter } from '@/i18n/navigation';
import { createRoom, ApiError } from '@/features/bingo/utils/api';
import { setToken } from '@/features/bingo/utils/token-store';

type Mode = 'create' | 'join';

export function HomeScreen() {
  const t = useTranslations('home');
  const tErr = useTranslations('errors');
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('create');
  const [name, setName] = useState('');
  const [joinName, setJoinName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canCreate = name.trim().length >= 2;
  const canJoin = code.trim().length === 5 && joinName.trim().length >= 2;

  async function onCreate() {
    setError(null);
    try {
      const res = await createRoom(name.trim());

      setToken(res.shortCode, res.adminToken);
      startTransition(() => {
        router.push(`/room/${res.shortCode}`);
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(tErr('connectionLost'));
      }
    }
  }

  function onJoin() {
    setError(null);
    if (!canJoin) {
      setError(tErr('invalidName'));

      return;
    }
    const params = new URLSearchParams({ name: joinName.trim() });

    startTransition(() => {
      router.push(`/room/${code.trim().toUpperCase()}?${params.toString()}`);
    });
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-7 text-center">
        <div className="mb-4 inline-flex items-center justify-center">
          <div className="ball" style={{ width: 92, height: 92 }}>
            <div className="ball__inner" style={{ width: 58, height: 58 }}>
              <span className="ball__num" style={{ fontSize: 26 }}>
                90
              </span>
            </div>
          </div>
        </div>
        <h1 className="font-display text-[38px] leading-tight font-bold tracking-tight">
          {t('heroTitle')}
        </h1>
        <p className="text-muted mt-2 text-base whitespace-pre-line">{t('heroSubtitle')}</p>
      </div>

      <div className="surface p-2" style={{ borderRadius: 24 }}>
        <div className="bg-paper mb-4 grid grid-cols-2 gap-1 rounded-2xl p-1">
          {(['create', 'join'] as const).map((m) => {
            const active = mode === m;

            return (
              <button
                key={m}
                className={`h-11 cursor-pointer rounded-[13px] text-[15px] font-semibold transition ${
                  active ? 'bg-surface text-ink shadow-bingo-sm' : 'text-muted'
                }`}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
              >
                {t(`tabs.${m}`)}
              </button>
            );
          })}
        </div>

        {error ? <div className="banner banner--error mx-2 mb-3">{error}</div> : null}

        <div className="px-2 pb-3">
          {mode === 'create' ? (
            <div className="flex flex-col gap-4">
              <Field htmlFor="create-name" label={t('nameLabel')}>
                <input
                  className="border-line h-[54px] w-full rounded-xl border px-4 text-[17px]"
                  id="create-name"
                  maxLength={16}
                  placeholder={t('namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canCreate) onCreate();
                  }}
                />
              </Field>
              <Button
                block
                disabled={!canCreate || isPending}
                icon="plus"
                size="lg"
                onClick={onCreate}
              >
                {t('createCta')}
              </Button>
              <p className="text-muted text-center text-[13px]">{t('createHint')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Field htmlFor="join-code" label={t('codeLabel')}>
                <input
                  className="border-line font-num h-[54px] w-full rounded-xl border px-4 text-center text-[22px] font-semibold tracking-[0.32em] uppercase"
                  id="join-code"
                  maxLength={5}
                  placeholder={t('codePlaceholder')}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
              </Field>
              <Field htmlFor="join-name" label={t('nameLabel')}>
                <input
                  className="border-line h-[54px] w-full rounded-xl border px-4 text-[17px]"
                  id="join-name"
                  maxLength={16}
                  placeholder={t('namePlaceholder')}
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canJoin) onJoin();
                  }}
                />
              </Field>
              <Button
                block
                disabled={!canJoin || isPending}
                iconRight="arrowRight"
                size="lg"
                onClick={onJoin}
              >
                {t('joinCta')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  htmlFor,
  label,
  children,
}: {
  htmlFor: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-muted text-[13px] font-medium" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}
