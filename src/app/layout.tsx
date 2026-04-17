import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'PlayForPurpose — Golf with Impact',
  description: 'Play golf, win prizes, and give back. PlayForPurpose is the subscription platform that combines Stableford golf scoring with monthly prize draws and charity contributions.',
  keywords: ['golf', 'charity', 'prize draw', 'stableford', 'subscription', 'impact'],
  openGraph: {
    title: 'PlayForPurpose — Golf with Impact',
    description: 'Play golf, win prizes, and give back.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        {/* Razorpay Checkout Script */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="bg-forest-900 text-cream-100 antialiased min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
