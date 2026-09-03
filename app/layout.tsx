import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '端云AI集成开发模式体验',
  description: '一个端侧SDK、一条轻量连接、一套AIoT平台，让AI从自然语言需求走到真实设备验证。',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: '端云AI集成开发模式体验',
    description: '从自然语言需求，到真实设备验证。',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: '端云AI集成开发模式体验' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '端云AI集成开发模式体验',
    description: '从自然语言需求，到真实设备验证。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
