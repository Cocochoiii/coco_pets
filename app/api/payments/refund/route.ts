// app/api/payments/refund/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import Booking from '@/models/Booking'
import { verifyAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validateRequired, ErrorCodes } from '@/lib/api-utils'
import { stripe, formatAmount } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) return errorResponse('Admin access required', 403, ErrorCodes.AUTHORIZATION_ERROR)

    const body = await request.json()
    const { orderId, amount, reason } = body

    const validationError = validateRequired(body, ['orderId'])
    if (validationError) return errorResponse(validationError, 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    const order = await Order.findOne({ orderId })
    if (!order) return errorResponse('Order not found', 404, ErrorCodes.NOT_FOUND)
    if (!order.stripePaymentIntentId) return errorResponse('No payment to refund', 400, ErrorCodes.VALIDATION_ERROR)

    const maxRefund = order.amounts.paid - order.amounts.refunded
    const refundAmount = amount ? Math.min(amount, maxRefund) : maxRefund
    if (refundAmount <= 0) return errorResponse('Nothing to refund', 400, ErrorCodes.VALIDATION_ERROR)

    const refund = await stripe.refunds.create({
      payment_intent: order.stripePaymentIntentId,
      amount: refundAmount,
      reason: reason === 'duplicate' ? 'duplicate' : reason === 'fraudulent' ? 'fraudulent' : 'requested_by_customer',
    })

    const refundRecord = {
      refundId: `REF-${Date.now()}`,
      stripeRefundId: refund.id,
      amount: refundAmount,
      reason: reason || 'Customer requested',
      status: refund.status,
      createdAt: new Date(),
    }

    const isFullRefund = refundAmount >= order.amounts.paid - order.amounts.refunded

    await Order.findByIdAndUpdate(order._id, {
      $push: { refunds: refundRecord },
      $set: {
        status: isFullRefund ? 'refunded' : 'partially_refunded',
        'amounts.refunded': order.amounts.refunded + refundAmount,
        refundedAt: new Date(),
      },
    })

    if (order.booking) {
      await Booking.findByIdAndUpdate(order.booking, {
        $set: { paymentStatus: isFullRefund ? 'refunded' : 'deposit_paid' },
        $inc: { refundedAmount: refundAmount },
      })
    }

    return successResponse({
      refundId: refundRecord.refundId,
      stripeRefundId: refund.id,
      amount: refundAmount,
      amountFormatted: formatAmount(refundAmount),
      status: refund.status,
    }, 'Refund processed successfully')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
