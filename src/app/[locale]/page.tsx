import { setRequestLocale } from 'next-intl/server';

import { TopBar } from '@/common/ui/top-bar/top-bar';
import { HomeScreen } from '@/features/bingo/components/home-screen/home-screen';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 pt-2 pb-16 lg:max-w-[1180px]">
      <TopBar />
      <div className="mt-12 flex flex-1 items-start justify-center">
        <HomeScreen />
      </div>
    </main>
  );
}
