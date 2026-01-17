// hooks/usePayment.tsx
'use client'

import { useState, useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface PriceCalculation {
  dailyRate: number
  days: number
  subtotal: number
  addOnsTotal: number
  discount: number
  discountReason: string
  discountPercentage: number
  tax: number
  total: number
  formatted: {
    dailyRate: string
    subtotal: string
    addOnsTotal: string
    discount: string
    tax: string
    total: string
  }
  depositOptions: {
    deposit30: { amount: number; formatted: string; percentage: number }
    deposit50: { amount: number; formatted: string; percentage: number }
  }
}

interface UsePaymentReturn {
  loading: boolean
  error: string | null
  priceCalculation: PriceCalculation | null
  calculatePrice: (params: CalculatePriceParams) => Promise<PriceCalculation | null>
  checkout: (bookingId: string, paymentType?: 'full' | 'deposit') => Promise<boolean>
  validatePromoCode: (code: string, days: number) => Promise<{ valid: boolean; discount?: number }>
  getPaymentHistory: () => Promise<any[]>
}

interface CalculatePriceParams {
  petType: 'cat' | 'dog'
  petSize?: 'small' | 'medium' | 'large'
  startDate: string
  endDate: string
  addOns?: string[]
  promoCode?: string
  isReturningCustomer?: boolean
}

export function usePayment(): UsePaymentReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null)

  const calculatePrice = useCallback(async (params: CalculatePriceParams): Promise<PriceCalculation | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/payments/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      const data = await res.json()
      if (data.success) {
        setPriceCalculation(data.data)
        return data.data
      }
      setError(data.error)
      return null
    } catch (e: any) {
      setError(e.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const checkout = useCallback(async (bookingId: string, paymentType: 'full' | 'deposit' = 'full'): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, paymentType }),
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success && data.data.sessionUrl) {
        window.location.href = data.data.sessionUrl
        return true
      }
      setError(data.error)
      return false
    } catch (e: any) {
      setError(e.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const validatePromoCode = useCallback(async (code: string, days: number): Promise<{ valid: boolean; discount?: number }> => {
    try {
      const res = await fetch('/api/payments/calculate')
      const data = await res.json()
      if (data.success) {
        const promoCodes = data.data.promoCodes || []
        const valid = promoCodes.includes(code.toUpperCase())
        return { valid, discount: valid ? 10 : undefined }
      }
      return { valid: false }
    } catch {
      return { valid: false }
    }
  }, [])

  const getPaymentHistory = useCallback(async (): Promise<any[]> => {
    try {
      const res = await fetch('/api/payments/history', { credentials: 'include' })
      const data = await res.json()
      return data.success ? data.data.orders : []
    } catch {
      return []
    }
  }, [])

  return {
    loading,
    error,
    priceCalculation,
    calculatePrice,
    checkout,
    validatePromoCode,
    getPaymentHistory,
  }
}

export default usePayment
