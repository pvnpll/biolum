import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'BioLum — Create Your Marriage Biodata',
  description: 'Create beautiful matrimonial biodata in minutes. 10+ designer templates, instant PDF & WhatsApp-ready image export. Free online biodata maker.',
  keywords: ['biodata', 'marriage biodata', 'matrimonial biodata', 'biodata maker', 'free biodata'],
  openGraph: {
    title: 'BioLum — Create Your Marriage Biodata',
    description: 'Create beautiful matrimonial biodata in minutes. 10+ designer templates, instant PDF & WhatsApp-ready image export.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
