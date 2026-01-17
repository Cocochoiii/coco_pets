import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { connectDB } from '@/lib/mongodb'
import mongoose from 'mongoose'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
})

const UserBookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    petName: { type: String, required: true },
    petType: { type: String, enum: ['cat', 'dog'], required: true },
    petBreed: { type: String },
    service: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    paymentStatus: { type: String, default: 'pending' },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
}, { timestamps: true })

const UserBooking = mongoose.models.UserBooking || mongoose.model('UserBooking', UserBookingSchema)

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const sessionId = searchParams.get('session_id')

        if (!sessionId) {
            return NextResponse.json(
                { success: false, error: 'Session ID required' },
                { status: 400 }
            )
        }

        // Verify payment with Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status !== 'paid') {
            return NextResponse.json(
                { success: false, error: 'Payment not completed' },
                { status: 400 }
            )
        }

        await connectDB()

        // Update booking status
        const bookings = await UserBooking.find({ stripeSessionId: sessionId })

        if (bookings.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Booking not found' },
                { status: 404 }
            )
        }

        // Update all bookings with this session to confirmed
        await UserBooking.updateMany(
            { stripeSessionId: sessionId },
            { 
                $set: { 
                    status: 'confirmed',
                    paymentStatus: 'paid',
                    stripePaymentIntentId: session.payment_intent as string
                }
            }
        )

        const updatedBooking = await UserBooking.findOne({ stripeSessionId: sessionId })

        return NextResponse.json({
            success: true,
            booking: {
                petName: updatedBooking.petName,
                service: updatedBooking.service,
                checkIn: updatedBooking.checkIn,
                checkOut: updatedBooking.checkOut,
                totalPrice: updatedBooking.totalPrice,
                status: 'confirmed'
            },
            paymentDetails: {
                amount: session.amount_total ? session.amount_total / 100 : 0,
                status: session.payment_status,
                email: session.customer_details?.email
            }
        })
    } catch (error: any) {
        console.error('Verification error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Verification failed' },
            { status: 500 }
        )
    }
}
