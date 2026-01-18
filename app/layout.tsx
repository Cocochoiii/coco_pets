import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'
import BackgroundMusic from '@/components/BackgroundMusic'
import PageTransition from '@/components/PageTransition'
import { MusicProvider } from '@/contexts/MusicContext'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter'
})

const poppins = Poppins({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    variable: '--font-poppins'
})

export const metadata: Metadata = {
    title: "Coco's Pet Paradise - Luxury Home Pet Boarding in Boston",
    description: 'Premium home-style pet boarding in Wellesley Hills. 24/7 care for 13 cats and 8 dogs. Serving Greater Boston within 50 miles.',
    keywords: 'pet boarding, dog boarding, cat boarding, Boston, Wellesley Hills, luxury pet care',
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#EEE1DB',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="smooth-scroll">
        <head>
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        </head>
        <body className={`${inter.variable} ${poppins.variable} font-sans noise-texture overflow-x-hidden`}>
        <MusicProvider>
            <PageTransition>
                <Navigation />
                <main className="min-h-screen overflow-x-hidden">
                    {children}
                </main>
                <Footer />
                <ChatWidget />
                <BackgroundMusic />
            </PageTransition>
        </MusicProvider>

        <Toaster
            position="bottom-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: 'linear-gradient(135deg, #3A3330 0%, #2A2522 100%)',
                    color: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '14px',
                    maxWidth: '90vw',
                },
                success: {
                    iconTheme: {
                        primary: '#D4A5A5',
                        secondary: '#fff',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#C17B7B',
                        secondary: '#fff',
                    },
                },
            }}
        />
        </body>
        </html>
    )
}