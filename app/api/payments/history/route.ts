// app/api/payments/history/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyAuth } from '@/lib/auth'
import { successResponse, errorResponse, getPaginationParams, ErrorCodes } from '@/lib/api-utils'
import { formatAmount } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Not authenticated', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = getPaginationParams(searchParams)

    await connectDB()

    const [orders, total] = await Promise.all([
      Order.find({ user: auth.userId })
        .populate('booking', 'bookingNumber petDetails startDate endDate')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ user: auth.userId }),
    ])

    return successResponse({
      orders: orders.map((o: any) => ({
        ...o.toObject(),
        amounts: {
          ...o.amounts,
          totalFormatted: formatAmount(o.amounts.total),
          paidFormatted: formatAmount(o.amounts.paid),
          refundedFormatted: formatAmount(o.amounts.refunded),
        },
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
