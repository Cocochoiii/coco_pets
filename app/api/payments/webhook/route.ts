// app/api/payments/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import Order from '@/models/Order'
import User from '@/models/User'
import { Notification } from '@/models/Notification'
import { stripe } from '@/lib/stripe'
import config from '@/config'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, config.stripe.webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  await connectDB()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { bookingId, orderId, paymentType } = session.metadata || {}

        if (!orderId) break

        await Order.findOneAndUpdate({ orderId }, {
          $set: {
            status: 'paid',
            stripePaymentIntentId: session.payment_intent as string,
            'amounts.paid': session.amount_total,
            paidAt: new Date(),
          },
        })

        if (bookingId) {
          const paymentStatus = paymentType === 'deposit' ? 'deposit_paid' : 'paid'
          await Booking.findByIdAndUpdate(bookingId, {
            $set: { paymentStatus, status: 'confirmed' },
            $inc: { paidAmount: session.amount_total },
          })
        }

        const order = await Order.findOne({ orderId })
        if (order?.user) {
          await User.findByIdAndUpdate(order.user, { $inc: { totalSpent: session.amount_total || 0 } })
          await Notification.create({
            user: order.user,
            type: 'payment',
            title: 'Payment Successful',
            message: `Your payment of $${((session.amount_total || 0) / 100).toFixed(2)} has been received.`,
            data: { orderId, bookingId },
            channels: ['in_app', 'email'],
          })
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const { orderId } = session.metadata || {}
        if (orderId) await Order.findOneAndUpdate({ orderId }, { $set: { status: 'expired' } })
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const order = await Order.findOne({ stripePaymentIntentId: charge.payment_intent })
        if (order) {
          const isFullRefund = charge.amount_refunded >= order.amounts.paid
          await Order.findByIdAndUpdate(order._id, {
            $set: {
              status: isFullRefund ? 'refunded' : 'partially_refunded',
              'amounts.refunded': charge.amount_refunded,
              refundedAt: new Date(),
            },
          })
          if (order.booking) {
            await Booking.findByIdAndUpdate(order.booking, {
              $set: { paymentStatus: isFullRefund ? 'refunded' : 'deposit_paid' },
            })
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
