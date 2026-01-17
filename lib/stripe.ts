// lib/stripe.ts
import Stripe from 'stripe'
import config from '@/config'

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function calculateDays(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

interface PriceCalculationParams {
  petType: 'cat' | 'dog'
  petSize?: 'small' | 'medium' | 'large'
  startDate: Date
  endDate: Date
  addOns?: string[]
  promoCode?: string
  isReturningCustomer?: boolean
}

interface PriceCalculationResult {
  dailyRate: number
  days: number
  subtotal: number
  addOnsTotal: number
  discount: number
  discountReason: string
  discountPercentage: number
  tax: number
  total: number
}

export function calculatePrice(params: PriceCalculationParams): PriceCalculationResult {
  const { petType, petSize = 'medium', startDate, endDate, addOns = [], promoCode, isReturningCustomer } = params
  
  const days = calculateDays(startDate, endDate)
  
  // Get daily rate
  let dailyRate: number
  if (petType === 'cat') {
    dailyRate = config.pricing.cat.daily
  } else {
    dailyRate = config.pricing.dog[petSize as keyof typeof config.pricing.dog] || config.pricing.dog.medium
  }
  
  let subtotal = dailyRate * days

  // Calculate add-ons
  let addOnsTotal = 0
  for (const addOn of addOns) {
    const addOnPrice = config.pricing.addOns[addOn as keyof typeof config.pricing.addOns]
    if (addOnPrice) addOnsTotal += addOnPrice * days
  }

  subtotal += addOnsTotal

  // Calculate discounts
  let discountPercentage = 0
  let discountReason = ''

  // Duration discount
  if (days >= 30) {
    discountPercentage = config.pricing.discounts.monthly
    discountReason = 'Monthly discount (15%)'
  } else if (days >= 14) {
    discountPercentage = config.pricing.discounts.biweekly
    discountReason = 'Bi-weekly discount (12%)'
  } else if (days >= 7) {
    discountPercentage = config.pricing.discounts.weekly
    discountReason = 'Weekly discount (10%)'
  }

  // Returning customer
  if (isReturningCustomer) {
    discountPercentage += config.pricing.discounts.returning
    discountReason += discountReason ? ' + Returning customer (5%)' : 'Returning customer (5%)'
  }

  // Promo code
  if (promoCode && config.pricing.promoCodes[promoCode]) {
    const promo = config.pricing.promoCodes[promoCode]
    if (days >= promo.minDays) {
      if (promo.type === 'percentage') {
        discountPercentage += promo.value / 100
        discountReason += discountReason ? ` + Promo ${promoCode} (${promo.value}%)` : `Promo ${promoCode} (${promo.value}%)`
      }
    }
  }

  const discount = Math.round(subtotal * discountPercentage)
  const afterDiscount = subtotal - discount
  const tax = Math.round(afterDiscount * config.pricing.taxRate)
  const total = afterDiscount + tax

  return {
    dailyRate,
    days,
    subtotal,
    addOnsTotal,
    discount,
    discountReason: discountReason || 'No discount',
    discountPercentage: Math.round(discountPercentage * 100),
    tax,
    total,
  }
}

export async function getOrCreateStripeCustomer(email: string, name?: string): Promise<string> {
  const customers = await stripe.customers.list({ email, limit: 1 })
  
  if (customers.data.length > 0) {
    return customers.data[0].id
  }

  const customer = await stripe.customers.create({ email, name })
  return customer.id
}
