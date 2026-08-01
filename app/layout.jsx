import './globals.css';
import { Space_Grotesk, Manrope, JetBrains_Mono } from 'next/font/google';

const display = Space_Grotesk({ subsets: ['latin'], weight: ['300','400','500','700'], variable: '--font-display' });
const sans = Manrope({ subsets: ['latin'], weight: ['300','400','500','600','700','800'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400','500'], variable: '--font-mono' });

export const metadata = {
  title: 'VRX Music — Personal Sound Sanctuary',
  description: 'Continuous background music stream with procedural WebGL atmospheres, paired with INDRISMA, a minimal movie tracker.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}