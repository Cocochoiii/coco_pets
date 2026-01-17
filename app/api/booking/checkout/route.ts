import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { verifyAuth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
})

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
    basePrice: { type: Number, required: true },
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
}, { timestamps: true })

const UserBooking = mongoose.models.UserBooking || mongoose.model('UserBooking', UserBookingSchema)

// POST - Create booking and Stripe checkout session
export async function POST(req: NextRequest) {
    try {
        const auth = await verifyAuth(req)
        if (!auth) {
            return NextResponse.json(
                { success: false, error: 'Please log in to complete booking' },
                { status: 401 }
            )
        }

        const body = await req.json()
        const { booking } = body

        if (!booking) {
            return NextResponse.json(
                { success: false, error: 'Booking details required' },
                { status: 400 }
            )
        }

        const {
            serviceType,
            petType,
            checkInDate,
            checkOutDate,
            checkInTime,
            checkOutTime,
            pets,
            addOns = [],
            totalPrice,
            nights,
            specialRequests,
            emergencyContact
        } = booking

        // Validate required fields
        if (!checkInDate || !checkOutDate || !pets || pets.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Missing required booking information' },
                { status: 400 }
            )
        }

        await connectDB()

        // Add-on pricing
        const addOnPrices: Record<string, { name: string; price: number; perDay: boolean }> = {
            'grooming': { name: 'Basic Grooming', price: 25, perDay: false },
            'photos': { name: 'Daily Photo Updates', price: 5, perDay: true },
            'playtime': { name: 'Extra Playtime', price: 10, perDay: false },
            'pickup': { name: 'Pickup Service', price: 20, perDay: false },
            'medication': { name: 'Medication Administration', price: 5, perDay: true },
            'webcam': { name: 'Live Webcam Access', price: 10, perDay: true },
        }

        // Create line items for each pet
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

        for (const pet of pets) {
            let petPrice = 0
            if (pet.type === 'cat') {
                petPrice = serviceType === 'boarding' ? 25 : 15
            } else {
                const weight = parseInt(pet.weight) || 30
                if (weight <= 20) petPrice = serviceType === 'boarding' ? 40 : 25
                else if (weight <= 50) petPrice = serviceType === 'boarding' ? 50 : 30
                else petPrice = serviceType === 'boarding' ? 60 : 35
            }

            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${serviceType === 'boarding' ? 'Overnight Boarding' : 'Day Care'} - ${pet.name}`,
                        description: `${pet.breed || pet.type} | ${nights} ${serviceType === 'boarding' ? 'night(s)' : 'day(s)'}`,
                    },
                    unit_amount: Math.round(petPrice * nights * 100),
                },
                quantity: 1,
            })
        }

        // Add add-ons as separate line items
        for (const addOnId of addOns) {
            const addOn = addOnPrices[addOnId]
            if (addOn) {
                const addOnTotal = addOn.perDay ? addOn.price * nights : addOn.price
                lineItems.push({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: addOn.name,
                            description: addOn.perDay ? `$${addOn.price}/day × ${nights} days` : 'One-time service',
                        },
                        unit_amount: Math.round(addOnTotal * 100),
                    },
                    quantity: 1,
                })
            }
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/booking/cancel`,
            customer_email: auth.user.email,
            metadata: {
                userId: auth.userId,
                serviceType,
                petType,
                checkInDate,
                checkOutDate,
                nights: nights.toString(),
                petNames: pets.map((p: { name: string }) => p.name).join(', '),
            },
        })

        // Create pending bookings for each pet
        const createdBookings = []
        for (const pet of pets) {
            let basePrice = 0
            if (pet.type === 'cat') {
                basePrice = serviceType === 'boarding' ? 25 : 15
            } else {
                const weight = parseInt(pet.weight) || 30
                if (weight <= 20) basePrice = serviceType === 'boarding' ? 40 : 25
                else if (weight <= 50) basePrice = serviceType === 'boarding' ? 50 : 30
                else basePrice = serviceType === 'boarding' ? 60 : 35
            }

            const addOnsList = addOns.map((id: string) => {
                const a = addOnPrices[id]
                return a ? { name: a.name, price: a.perDay ? a.price * nights : a.price } : null
            }).filter(Boolean)

            const addOnsTotal = addOnsList.reduce((sum: number, a: { price: number } | null) => sum + (a?.price || 0), 0) / pets.length

            const newBooking = await UserBooking.create({
                userId: auth.userId,
                petName: pet.name,
                petType: pet.type,
                petBreed: pet.breed,
                service: serviceType === 'boarding' ? 'Overnight Boarding' : 'Day Care',
                checkIn: new Date(checkInDate),
                checkOut: new Date(checkOutDate),
                checkInTime: checkInTime || '14:00',
                checkOutTime: checkOutTime || '11:00',
                nights,
                basePrice: basePrice * nights,
                addOns: addOnsList,
                addOnsTotal,
                totalPrice: (basePrice * nights) + addOnsTotal,
                stripeSessionId: session.id,
                specialRequests,
                emergencyContact,
                petDetails: {
                    feedingInstructions: pet.feedingInstructions,
                    medications: pet.medications,
                    specialNeeds: pet.specialNeeds,
                    vaccinated: pet.vaccinated,
                    neutered: pet.neutered,
                },
                status: 'pending',
                paymentStatus: 'pending'
            })
            createdBookings.push(newBooking)
        }

        return NextResponse.json({
            success: true,
            sessionId: session.id,
            url: session.url,
            bookingIds: createdBookings.map(b => b._id)
        })
    } catch (error: unknown) {
        console.error('Booking checkout error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Checkout failed'
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        )
    }
}