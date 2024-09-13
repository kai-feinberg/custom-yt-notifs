import type { Metadata } from 'next'

import  QueryWrapper from '@/components/QueryWrapper'
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
      <QueryWrapper>
        <body>{children}</body>
      </QueryWrapper >
    </html >
  )
}