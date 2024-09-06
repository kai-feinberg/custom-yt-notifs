import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YouTube Notifier',
  description: 'Get notified for custom YouTube events',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}