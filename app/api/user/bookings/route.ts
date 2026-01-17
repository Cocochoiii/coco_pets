import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth'
import mongoose from 'mongoose'

// User Booking Schema
const UserBookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPet' },
    petName: { type: String, required: true },
    petType: { type: String, enum: ['cat', 'dog'], required: true },
    petBreed: { type: String },
    service: { type: String, required: true }, // 'Overnight Boarding', 'Day Care'
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    checkInTime: { type: String, default: '14:00' },
    checkOutTime: { type: String, default: '11:00' },
    nights: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    addOns: [{
        name: String,
        price: Number
    }],
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
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    },
    petDetails: {
        feedingInstructions: String,
        medications: String,
        specialNeeds: String,
        vaccinated: Boolean,
        neutered: Boolean
    },
    cancellationReason: { type: String },
    cancelledAt: { type: Date },
}, { timestamps: true })

const UserBooking = mongoose.models.UserBooking || mongoose.model('UserBooking', UserBookingSchema)

// GET - Get user's bookings
export async function GET(req: NextRequest) {
    try {
        const user = await verifyToken(req)
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()
        
        const { searchParams } = new URL(req.url)
        const status = searchParams.get('status')
        
        const query: any = { userId: user.id }
        if (status) {
            query.status = status
        }

        const bookings = await UserBooking.find(query)
            .sort({ checkIn: -1 })
            .limit(50)

        return NextResponse.json({ success: true, bookings })
    } catch (error) {
        console.error('Error fetching bookings:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 })
    }
}

// POST - Create new booking
export async function POST(req: NextRequest) {
    try {
        const user = await verifyToken(req)
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const {
            petId,
            petName,
            petType,
            petBreed,
            service,
            checkIn,
            checkOut,
            checkInTime,
            checkOutTime,
            nights,
            basePrice,
            addOns,
            addOnsTotal,
            totalPrice,
            notes,
            specialRequests,
            emergencyContact,
            petDetails,
            stripeSessionId
        } = body

        if (!petName || !petType || !service || !checkIn || !checkOut || !totalPrice) {
            return NextResponse.json({ 
                success: false, 
                error: 'Missing required fields' 
            }, { status: 400 })
        }

        await connectDB()

        // Check for overlapping bookings
        const existingBooking = await UserBooking.findOne({
            userId: user.id,
            petName: petName,
            status: { $in: ['pending', 'confirmed', 'active'] },
            $or: [
                {
                    checkIn: { $lte: new Date(checkOut) },
                    checkOut: { $gte: new Date(checkIn) }
                }
            ]
        })

        if (existingBooking) {
            return NextResponse.json({
                success: false,
                error: 'This pet already has a booking during these dates'
            }, { status: 400 })
        }

        const booking = await UserBooking.create({
            userId: user.id,
            petId,
            petName,
            petType,
            petBreed,
            service,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            checkInTime,
            checkOutTime,
            nights,
            basePrice,
            addOns,
            addOnsTotal,
            totalPrice,
            notes,
            specialRequests,
            emergencyContact,
            petDetails,
            stripeSessionId,
            status: 'pending',
            paymentStatus: 'pending'
        })

        return NextResponse.json({ success: true, booking })
    } catch (error) {
        console.error('Error creating booking:', error)
        return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 })
    }
}
