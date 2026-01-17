// app/api/payments/checkout/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import Order from '@/models/Order'
import User from '@/models/User'
import { verifyAuth } from '@/lib/auth'
import { successResponse, errorResponse, validateRequired, generateOrderId, ErrorCodes } from '@/lib/api-utils'
import { stripe, formatAmount, getOrCreateStripeCustomer } from '@/lib/stripe'
import config from '@/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, paymentType = 'full', successUrl, cancelUrl } = body

    const validationError = validateRequired(body, ['bookingId'])
    if (validationError) return errorResponse(validationError, 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    const booking = await Booking.findById(bookingId).populate('user')
    if (!booking) return errorResponse('Booking not found', 404, ErrorCodes.NOT_FOUND)
    if (booking.paymentStatus === 'paid') return errorResponse('Booking already paid', 400, ErrorCodes.VALIDATION_ERROR)

    let amount = booking.pricing.total
    let description = `Full payment for booking ${booking.bookingNumber}`

    if (paymentType === 'deposit') {
      amount = Math.round(booking.pricing.total * config.pricing.depositPercentage)
      description = `Deposit (30%) for booking ${booking.bookingNumber}`
    }

    let stripeCustomerId = (booking.user as any)?.stripeCustomerId
    if (!stripeCustomerId && booking.user) {
      stripeCustomerId = await getOrCreateStripeCustomer((booking.user as any).email, (booking.user as any).name)
      await User.findByIdAndUpdate((booking.user as any)._id, { stripeCustomerId })
    }

    const orderId = generateOrderId()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer: stripeCustomerId || undefined,
      customer_email: !stripeCustomerId ? booking.customer.email : undefined,
      line_items: [{
        price_data: {
          currency: config.stripe.currency,
          product_data: { name: `Pet Boarding - ${booking.petDetails.name}`, description },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      metadata: { bookingId, orderId, paymentType, bookingNumber: booking.bookingNumber },
      success_url: successUrl || `${config.app.url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${config.app.url}/payment/cancel?order_id=${orderId}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    })

    await Order.create({
      orderId,
      booking: bookingId,
      user: (booking.user as any)?._id,
      customer: { email: booking.customer.email, name: booking.customer.name, phone: booking.customer.phone },
      stripeSessionId: session.id,
      stripeCustomerId,
      amounts: { subtotal: booking.pricing.subtotal, discount: booking.pricing.discount, tax: booking.pricing.tax, total: amount, paid: 0, refunded: 0 },
      status: 'pending',
      paymentType,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    })

    await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'pending' })

    return successResponse({
      sessionId: session.id,
      sessionUrl: session.url,
      orderId,
      pricing: { amount, amountFormatted: formatAmount(amount), paymentType },
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) return errorResponse('Session ID required', 400)

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return successResponse({
      status: session.status,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
      amountTotalFormatted: formatAmount(session.amount_total || 0),
    })
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
