import { useTranslations } from 'next-intl';

export function ReconnectToast() {
  const t = useTranslations('common');
  return (
    <div className="reconnect-toast" role="status">
      <span className="spinner" />
      {t('reconnecting')}
    </div>
  );
}
