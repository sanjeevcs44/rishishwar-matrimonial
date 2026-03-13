import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rishishwar Matrimonial',
  description:
    'Rishishwar Matrimonial - Find your perfect match. Maintained by Rishishwar volunteers.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
