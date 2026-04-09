import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/shared/Navigation';

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '쉐어드서비스 운영평가 대시보드',
  description: '그룹사 쉐어드서비스 운영 수준 비교·평가 및 중점추진과제 관리',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50">
        <Navigation />
        <main className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8 flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
