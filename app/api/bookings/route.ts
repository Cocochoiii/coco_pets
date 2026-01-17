// app/api/bookings/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import User from '@/models/User'
import { verifyAuth } from '@/lib/auth'
import { successResponse, errorResponse, validateRequired, generateBookingNumber, getPaginationParams, ErrorCodes } from '@/lib/api-utils'
import { calculatePrice, formatAmount } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Not authenticated', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const { page, limit, skip } = getPaginationParams(searchParams)

    await connectDB()

    const query: any = { user: auth.userId }
    if (status) query.status = status

    const [bookings, total] = await Promise.all([
      Booking.find(query).populate('pet').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Booking.countDocuments(query),
    ])

    return successResponse({
      bookings: bookings.map((b: any) => ({
        ...b.toObject(),
        pricing: { ...b.pricing, totalFormatted: formatAmount(b.pricing.total) },
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { petDetails, startDate, endDate, addOns, specialRequests, customer, promoCode } = body

    const validationError = validateRequired(body, ['petDetails', 'startDate', 'endDate', 'customer'])
    if (validationError) return errorResponse(validationError, 400, ErrorCodes.VALIDATION_ERROR)

    const validationError2 = validateRequired(petDetails, ['name', 'type'])
    if (validationError2) return errorResponse(`Pet details: ${validationError2}`, 400, ErrorCodes.VALIDATION_ERROR)

    const validationError3 = validateRequired(customer, ['name', 'email'])
    if (validationError3) return errorResponse(`Customer: ${validationError3}`, 400, ErrorCodes.VALIDATION_ERROR)

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) return errorResponse('End date must be after start date', 400, ErrorCodes.VALIDATION_ERROR)
    if (start < new Date()) return errorResponse('Start date cannot be in the past', 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    const auth = await verifyAuth(request)
    let isReturningCustomer = false

    if (auth) {
      const user = await User.findById(auth.userId)
      if (user && user.totalBookings > 0) isReturningCustomer = true
    }

    const pricing = calculatePrice({
      petType: petDetails.type,
      petSize: petDetails.size || 'medium',
      startDate: start,
      endDate: end,
      addOns: addOns || [],
      promoCode,
      isReturningCustomer,
    })

    const booking = await Booking.create({
      bookingNumber: generateBookingNumber(),
      user: auth?.userId,
      petDetails,
      startDate: start,
      endDate: end,
      pricing,
      addOns: addOns || [],
      specialRequests,
      customer,
      source: 'website',
      promoCode,
    })

    return successResponse({
      booking: {
        ...booking.toObject(),
        pricing: { ...pricing, totalFormatted: formatAmount(pricing.total) },
      },
    }, 'Booking created successfully', 201)
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Not authenticated', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const body = await request.json()
    const { bookingId, specialRequests, status, cancellationReason } = body

    if (!bookingId) return errorResponse('Booking ID required', 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    const booking = await Booking.findOne({ _id: bookingId, user: auth.userId })
    if (!booking) return errorResponse('Booking not found', 404, ErrorCodes.NOT_FOUND)

    const updates: any = {}
    if (specialRequests !== undefined) updates.specialRequests = specialRequests

    if (status === 'cancelled') {
      if (!['pending', 'confirmed'].includes(booking.status)) {
        return errorResponse('Cannot cancel this booking', 400, ErrorCodes.VALIDATION_ERROR)
      }
      updates.status = 'cancelled'
      updates.cancellationReason = cancellationReason
      updates.cancelledAt = new Date()
      updates.cancelledBy = auth.userId
    }

    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, { $set: updates }, { new: true })

    return successResponse({ booking: updatedBooking }, 'Booking updated')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
