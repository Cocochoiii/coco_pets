// app/api/report-cards/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import ReportCard from '@/models/ReportCard'
import Booking from '@/models/Booking'
import { verifyAuth, verifyStaff } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes, getPaginationParams } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Authentication required', 401, ErrorCodes.AUTHENTICATION_ERROR)

    await connectDB()

    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = getPaginationParams(searchParams)
    const bookingId = searchParams.get('bookingId')
    const petId = searchParams.get('petId')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const query: any = {}

    // Customers can only see sent reports for their own bookings
    if (auth.user.role !== 'admin' && auth.user.role !== 'staff') {
      const userBookings = await Booking.find({ user: auth.userId }).select('_id')
      query.booking = { $in: userBookings.map(b => b._id) }
      query.status = 'sent'
    }

    if (bookingId) query.booking = bookingId
    if (petId) query.pet = petId
    if (status && (auth.user.role === 'admin' || auth.user.role === 'staff')) query.status = status
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    const [reports, total] = await Promise.all([
      ReportCard.find(query)
        .populate('pet', 'name type breed profileImage')
        .populate('booking', 'bookingNumber startDate endDate petDetails')
        .populate('staff', 'name')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReportCard.countDocuments(query)
    ])

    return successResponse({
      reports,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error: any) {
    console.error('Get report cards error:', error)
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyStaff(request)
    if (!auth) return errorResponse('Staff access required', 403, ErrorCodes.AUTHORIZATION_ERROR)

    await connectDB()

    const body = await request.json()
    const { bookingId, petId, date, activities, meals, healthObservations, walks, media, messageToParent, highlights, overallMood } = body

    if (!bookingId || !date) {
      return errorResponse('bookingId and date are required', 400, ErrorCodes.VALIDATION_ERROR)
    }

    const booking = await Booking.findById(bookingId)
    if (!booking) return errorResponse('Booking not found', 404, ErrorCodes.NOT_FOUND)

    // Check for existing report on same date
    const reportDate = new Date(date)
    const existingReport = await ReportCard.findOne({
      booking: bookingId,
      date: { $gte: new Date(reportDate.setHours(0, 0, 0, 0)), $lt: new Date(reportDate.setHours(23, 59, 59, 999)) }
    })

    if (existingReport) {
      return errorResponse('Report card already exists for this date', 400, ErrorCodes.DUPLICATE_ERROR)
    }

    const reportCard = new ReportCard({
      booking: bookingId,
      pet: petId || booking.pet,
      date: new Date(date),
      staff: auth.userId,
      activities: activities || [],
      meals: meals || [],
      healthObservations: healthObservations || {},
      walks: walks || [],
      media: media || [],
      messageToParent,
      highlights: highlights || [],
      overallMood: overallMood || 'good',
      status: 'draft'
    })

    await reportCard.save()

    const populated = await ReportCard.findById(reportCard._id)
      .populate('pet', 'name type breed profileImage')
      .populate('booking', 'bookingNumber startDate endDate petDetails')
      .populate('staff', 'name')

    return successResponse(populated, 'Report card created', 201)
  } catch (error: any) {
    console.error('Create report card error:', error)
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
