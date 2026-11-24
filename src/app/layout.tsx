import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const displayFont = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800'],
  display: 'swap',
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#090C12',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://archtier.dev'),
  title: {
    default: 'ArchTier — Architecture Guardrails That Scale With Your Stage',
    template: '%s · ArchTier',
  },
  description:
    'A phase-calibrated compiler of software architecture guardrails for AI coding agents (Antigravity, Cursor, Claude Code, Codex). Prevents premature over-engineering without sacrificing security or type-safety.',
  keywords: [
    'architecture guardrails',
    'AI coding agents',
    'Cursor rules',
    'Claude Code',
    'Antigravity',
    'software engineering',
    'system prompt compiler',
    'Next.js',
    'TypeScript',
  ],
  authors: [{ name: 'ArchTier Team', url: 'https://github.com/MasRizqi07/ArchTier-Project' }],
  creator: 'ArchTier',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'ArchTier — Architecture Guardrails That Scale With Your Stage',
    description:
      'Deterministic architecture rules for AI coding agents. Lock the security floor, defer premature complexity, and export rules for Cursor, Claude Code, and Antigravity in one click.',
    siteName: 'ArchTier',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArchTier — Adaptive Architecture Guardrails',
    description:
      'Deterministic architecture rules for AI coding agents. Zero AI slop, zero premature over-engineering.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <body className="antialiased min-h-screen relative text-ink-primary bg-bg-primary selection:bg-accent-soft selection:text-accent-primary">
        <div className="noise-overlay" aria-hidden="true" />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
