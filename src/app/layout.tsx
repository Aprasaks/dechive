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
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <div className="fixed inset-0 -z-10">
          <Image
            src="/images/library-main.webp"
            alt=""
            fill
            className="object-cover brightness-[0.35] blur-sm"
            priority
          />
        </div>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
