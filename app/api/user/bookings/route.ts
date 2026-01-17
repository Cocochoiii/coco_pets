import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { verifyAuth } from '@/lib/auth'
import mongoose from 'mongoose'

// User Booking Schema
const UserBookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    petName: { type: String, required: true },
    petType: { type: String, enum: ['cat', 'dog'], required: true },
    petBreed: { type: String },
    service: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    checkInTime: { type: String, default: '14:00' },
    checkOutTime: { type: String, default: '11:00' },
    nights: { type: Number, required: true },
    basePrice: { type: Number },
    addOns: [{ name: String, price: Number }],
    addOnsTotal: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded', 'failed'],
        default: 'pending'
    },
    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },
    notes: { type: String },
    specialRequests: { type: String },
}, { timestamps: true })

const UserBooking = mongoose.models.UserBooking || mongoose.model('UserBooking', UserBookingSchema)

// GET - Get all user bookings
export async function GET(req: NextRequest) {
    try {
        const auth = await verifyAuth(req)
        if (!auth) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()

        const { searchParams } = new URL(req.url)
        const status = searchParams.get('status')
        const limit = parseInt(searchParams.get('limit') || '10')
        const page = parseInt(searchParams.get('page') || '1')

        const query: Record<string, unknown> = { userId: auth.userId }
        if (status && status !== 'all') {
            query.status = status
        }

        const bookings = await UserBooking.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)

        const total = await UserBooking.countDocuments(query)

        return NextResponse.json({
            success: true,
            bookings,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching bookings:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 })
    }
}

// POST - Create a new booking (simple version without Stripe)
export async function POST(req: NextRequest) {
    try {
        const auth = await verifyAuth(req)
        if (!auth) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()

        await connectDB()

        const booking = await UserBooking.create({
            ...body,
            userId: auth.userId,
            status: 'pending',
            paymentStatus: 'pending'
        })

        return NextResponse.json({ success: true, booking })
    } catch (error) {
        console.error('Error creating booking:', error)
        return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 })
    }
}

// PUT - Update a booking
export async function PUT(req: NextRequest) {
    try {
        const auth = await verifyAuth(req)
        if (!auth) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { bookingId, ...updateData } = body

        if (!bookingId) {
            return NextResponse.json({ success: false, error: 'Booking ID required' }, { status: 400 })
        }

        await connectDB()

        const booking = await UserBooking.findOneAndUpdate(
            { _id: bookingId, userId: auth.userId },
            { $set: updateData },
            { new: true }
        )

        if (!booking) {
            return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, booking })
    } catch (error) {
        console.error('Error updating booking:', error)
        return NextResponse.json({ success: false, error: 'Failed to update booking' }, { status: 500 })
    }
}

// DELETE - Cancel a booking
export async function DELETE(req: NextRequest) {
    try {
        const auth = await verifyAuth(req)
        if (!auth) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const bookingId = searchParams.get('id')

        if (!bookingId) {
            return NextResponse.json({ success: false, error: 'Booking ID required' }, { status: 400 })
        }

        await connectDB()

        const booking = await UserBooking.findOneAndUpdate(
            { _id: bookingId, userId: auth.userId },
            { $set: { status: 'cancelled' } },
            { new: true }
        )

        if (!booking) {
            return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: 'Booking cancelled', booking })
    } catch (error) {
        console.error('Error cancelling booking:', error)
        return NextResponse.json({ success: false, error: 'Failed to cancel booking' }, { status: 500 })
    }
}