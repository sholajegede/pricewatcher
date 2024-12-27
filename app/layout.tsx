import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PriceWatcher | Amazon Price Tracker',
  description: 'Track Amazon product prices and get notified immediately when they drop.',
  icons: {
    icon: '/favicon.ico'
  },
  openGraph: {
    title: "PriceWatcher | Amazon Price Tracker",
    description: "Track Amazon product prices and get notified immediately when they drop.",
    images: [
      {
        url: 'https://pricewatcher.vercel.app/home.png',
        alt: 'PriceWatcher | Amazon Price Tracker'
      }
    ],
    type: 'website'
  },
  metadataBase: new URL('https://pricewatcher.vercel.app/'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
};