// app/api/payments/calculate/route.ts
import { NextRequest } from 'next/server'
import { successResponse, errorResponse, validateRequired, ErrorCodes } from '@/lib/api-utils'
import { calculatePrice, formatAmount } from '@/lib/stripe'
import config from '@/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { petType, petSize, startDate, endDate, addOns, promoCode, isReturningCustomer } = body

    const validationError = validateRequired(body, ['petType', 'startDate', 'endDate'])
    if (validationError) return errorResponse(validationError, 400, ErrorCodes.VALIDATION_ERROR)

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) return errorResponse('End date must be after start date', 400, ErrorCodes.VALIDATION_ERROR)

    const pricing = calculatePrice({
      petType, petSize: petSize || 'medium', startDate: start, endDate: end,
      addOns: addOns || [], promoCode, isReturningCustomer: isReturningCustomer || false,
    })

    const deposit30 = Math.round(pricing.total * 0.30)
    const deposit50 = Math.round(pricing.total * 0.50)

    return successResponse({
      ...pricing,
      formatted: {
        dailyRate: formatAmount(pricing.dailyRate),
        subtotal: formatAmount(pricing.subtotal),
        addOnsTotal: formatAmount(pricing.addOnsTotal),
        discount: formatAmount(pricing.discount),
        tax: formatAmount(pricing.tax),
        total: formatAmount(pricing.total),
      },
      depositOptions: {
        deposit30: { amount: deposit30, formatted: formatAmount(deposit30), percentage: 30 },
        deposit50: { amount: deposit50, formatted: formatAmount(deposit50), percentage: 50 },
      },
    })
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function GET() {
  return successResponse({
    pricing: config.pricing,
    addOns: Object.entries(config.pricing.addOns).map(([key, value]) => ({
      id: key, name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      price: value, priceFormatted: formatAmount(value),
    })),
    promoCodes: Object.keys(config.pricing.promoCodes),
    discounts: config.pricing.discounts,
  })
}
