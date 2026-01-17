// app/payment/success/page.tsx
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Home, Calendar, Sparkles } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/payments/checkout?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setSessionData(data.data)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    // Confetti effect
    const duration = 3 * 1000
    const end = Date.now() + duration
    const colors = ['#D4A5A5', '#EEE1DB', '#FFD700', '#FF69B4']

    const frame = () => {
      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEE1DB] via-white to-[#D4A5A5]/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#D4A5A5] via-[#EEE1DB] to-[#D4A5A5]" />
        
        <div className="relative">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
          
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Sparkles key={i} className="w-5 h-5 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Thank you for choosing Coco&apos;s Pet Paradise</p>

          {loading ? (
            <div className="animate-pulse bg-gray-100 rounded-xl p-4 mb-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
          ) : sessionData && (
            <div className="bg-gradient-to-r from-[#EEE1DB]/50 to-[#D4A5A5]/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
              <p className="text-2xl font-bold text-[#D4A5A5]">{sessionData.amountTotalFormatted}</p>
              {sessionData.customerEmail && (
                <p className="text-sm text-gray-500 mt-2">Confirmation sent to {sessionData.customerEmail}</p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full py-3 bg-[#D4A5A5] text-white rounded-xl hover:bg-[#c49494] transition-colors font-medium">
              <Calendar className="w-5 h-5" />
              View My Bookings
            </Link>
            <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 border-2 border-[#D4A5A5] text-[#D4A5A5] rounded-xl hover:bg-[#D4A5A5]/10 transition-colors font-medium">
              <Home className="w-5 h-5" />
              Return Home
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Questions? Contact us at (617) 762-8179
        </p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EEE1DB] via-white to-[#D4A5A5]/20">
        <div className="animate-spin w-8 h-8 border-4 border-[#D4A5A5] border-t-transparent rounded-full" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
