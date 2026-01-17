// app/payment/cancel/page.tsx
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle, Home, RotateCcw, Phone } from 'lucide-react'

function CancelContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEE1DB] via-white to-[#D4A5A5]/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300" />
        
        <div className="relative">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-14 h-14 text-red-400" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600 mb-6">No worries! Your booking is still saved.</p>

          {orderId && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Order Reference</p>
              <p className="font-mono text-gray-700">{orderId}</p>
            </div>
          )}

          <div className="bg-[#EEE1DB]/30 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-medium text-gray-700 mb-2">Why was my payment cancelled?</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• You clicked the back button or closed the window</li>
              <li>• The payment session expired (30 minutes)</li>
              <li>• You chose to cancel the payment</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full py-3 bg-[#D4A5A5] text-white rounded-xl hover:bg-[#c49494] transition-colors font-medium">
              <RotateCcw className="w-5 h-5" />
              Try Again
            </Link>
            <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium">
              <Home className="w-5 h-5" />
              Return Home
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Need help? We&apos;re here for you!</p>
            <a href="tel:+16177628179" className="inline-flex items-center gap-2 text-[#D4A5A5] font-medium hover:underline">
              <Phone className="w-4 h-4" />
              (617) 762-8179
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEE1DB] via-white to-[#D4A5A5]/20">
        <div className="animate-spin w-8 h-8 border-4 border-[#D4A5A5] border-t-transparent rounded-full" />
      </div>
    }>
      <CancelContent />
    </Suspense>
  )
}
