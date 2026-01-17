// app/api/reviews/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Review } from '@/models/System'
import Booking from '@/models/Booking'
import { verifyAuth, verifyAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validateRequired, sanitizeInput, getPaginationParams, ErrorCodes } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'approved'
    const featured = searchParams.get('featured')
    const userId = searchParams.get('user_id')
    const { page, limit, skip } = getPaginationParams(searchParams)

    await connectDB()

    const query: any = {}
    if (status !== 'all') query.status = status
    if (featured === 'true') query.isFeatured = true
    if (userId) query.user = userId

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('user', 'name avatar')
        .populate('pet', 'name type')
        .populate('booking', 'bookingNumber startDate endDate')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments(query),
    ])

    return successResponse({
      reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Authentication required', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const body = await request.json()
    const { bookingId, rating, title, content, images } = body

    const validationError = validateRequired(body, ['bookingId', 'rating'])
    if (validationError) return errorResponse(validationError, 400, ErrorCodes.VALIDATION_ERROR)

    if (rating < 1 || rating > 5) return errorResponse('Rating must be between 1 and 5', 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    const booking = await Booking.findOne({ _id: bookingId, user: auth.userId, status: 'completed' })
    if (!booking) return errorResponse('Booking not found or not eligible for review', 404, ErrorCodes.NOT_FOUND)

    const existingReview = await Review.findOne({ booking: bookingId })
    if (existingReview) return errorResponse('Booking already reviewed', 400, ErrorCodes.VALIDATION_ERROR)

    const review = await Review.create({
      booking: bookingId,
      user: auth.userId,
      pet: booking.pet,
      rating,
      title: title ? sanitizeInput(title) : undefined,
      content: content ? sanitizeInput(content) : undefined,
      images: images || [],
      status: 'pending',
      isVerified: true,
    })

    return successResponse(review, 'Review submitted for approval')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) return errorResponse('Admin access required', 403, ErrorCodes.AUTHORIZATION_ERROR)

    const body = await request.json()
    const { reviewId, status, isFeatured, response } = body

    if (!reviewId) return errorResponse('Review ID required', 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    const updates: any = {}
    if (status) updates.status = status
    if (typeof isFeatured === 'boolean') updates.isFeatured = isFeatured
    if (response) {
      updates.response = { content: sanitizeInput(response), respondedBy: auth.userId, respondedAt: new Date() }
    }

    const review = await Review.findByIdAndUpdate(reviewId, { $set: updates }, { new: true })
    if (!review) return errorResponse('Review not found', 404, ErrorCodes.NOT_FOUND)

    return successResponse(review, 'Review updated')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) return errorResponse('Admin access required', 403, ErrorCodes.AUTHORIZATION_ERROR)

    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('id')

    if (!reviewId) return errorResponse('Review ID required', 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()
    await Review.findByIdAndDelete(reviewId)

    return successResponse(null, 'Review deleted')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
