import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Crescent Moon Cocker Spaniels | Premium American Cocker Spaniel Breeder',
    template: '%s | Crescent Moon Cocker Spaniels'
  },
  description: 'Find your perfect American Cocker Spaniel puppy at Crescent Moon Sanctuary. We are premium breeders of healthy, socialized, and beautiful Cocker Spaniels from champion bloodlines. Based in Portland, Oregon with nationwide shipping.',
  keywords: [
    'Cocker Spaniel', 
    'American Cocker Spaniel', 
    'Spaniel Puppies for Sale', 
    'Cocker Spaniel Breeder Oregon', 
    'Premium Dog Breeder', 
    'Puppies for sale Portland', 
    'Crescent Moon Sanctuary',
    'Champion Bloodline Cocker Spaniels',
    'Socialized Puppies'
  ],
  authors: [{ name: 'Crescent Moon Spaniels' }],
  creator: 'Crescent Moon Spaniels',
  publisher: 'Crescent Moon Spaniels',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://crescentmooncocker.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Crescent Moon Cocker Spaniels | Premium Breeder',
    description: 'Top-quality American Cocker Spaniel puppies for sale. Healthy, home-raised, and socialized spaniels from champion bloodlines.',
    url: 'https://crescentmooncocker.com',
    siteName: 'Crescent Moon Cocker Spaniels',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Crescent Moon Cocker Spaniels Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crescent Moon Cocker Spaniels | Premium Breeder',
    description: 'Top-quality American Cocker Spaniel puppies for sale. Healthy, home-raised, and socialized spaniels from champion bloodlines.',
    images: ['/logo.png'],
  },
  verification: {
    google: 'googlece4fe962277506d0',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  'name': 'Crescent Moon Cocker Spaniels',
  'image': 'https://crescentmooncocker.com/logo.png',
  '@id': 'https://crescentmooncocker.com',
  'url': 'https://crescentmooncocker.com',
  'telephone': '',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': '',
    'addressLocality': 'Portland',
    'addressRegion': 'OR',
    'postalCode': '',
    'addressCountry': 'US'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 45.5152,
    'longitude': -122.6784
  },
  'openingHoursSpecification': {
    '@type': 'OpeningHoursSpecification',
    'dayOfWeek': [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ],
    'opens': '09:00',
    'closes': '18:00'
  },
  'sameAs': [
    'https://www.instagram.com/crescentmooncocker'
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
