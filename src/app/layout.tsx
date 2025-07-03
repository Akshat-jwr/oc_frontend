// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/layout/Header';     
import Footer from '@/components/layout/Footer';   
import ErrorBoundary from '@/components/ErrorBoundary';

// Configure the primary font for the application
const inter = Inter({ subsets: ['latin'] });

// Default SEO metadata for the application
export const metadata: Metadata = {
  title: 'Om Creations - Personalized Gifts & Custom Corporate Gifting',
  description: 'Discover unique personalized gifts for every occasion. From custom photo frames and mugs to corporate branding solutions, Om Creations brings your ideas to life.',
  keywords: ['personalized gifts', 'custom gifts', 'corporate gifting', 'photo frames', 'custom mugs'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-800`}>
        {/* The AppProvider will manage all global state like user authentication, cart, etc. */}
        <AppProvider>
          {/* Toaster is for showing pop-up notifications (e.g., "Item added to cart") */}
          <Toaster position="bottom-right" toastOptions={{
            className: 'text-sm font-medium',
            duration: 4000,
          }} />
          
          <div className="flex flex-col min-h-screen">
            <ErrorBoundary fallback={<div className="h-16 bg-gray-900"></div>}>
  <Header />
</ErrorBoundary>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
