import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Malta Government Tenders',
  description: 'Comprehensive source for all Maltese government tenders',
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
