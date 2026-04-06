import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Image from 'next/image';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Dechive',
  description: "Demian's Archive & Logs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} flex min-h-screen flex-col font-sans antialiased`}
      >
        <div className="fixed inset-0 -z-10 flex justify-center overflow-hidden bg-black">
          <div className="relative h-full w-full max-w-344">
            <Image
              src="/images/library-main.webp"
              alt=""
              fill
              className="object-cover blur-xs brightness-[0.35]"
              priority
            />
            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-black to-transparent" />
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-black to-transparent" />
          </div>
        </div>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
