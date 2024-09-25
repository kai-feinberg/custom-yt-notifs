import type { Metadata } from 'next'
import ClientLayout from './ClientLayout'
import '@/app/globals.css'

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
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}