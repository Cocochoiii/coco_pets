// app/api/admin/bookings/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import { verifyAdmin } from '@/lib/auth'
import { successResponse, errorResponse, getPaginationParams, ErrorCodes } from '@/lib/api-utils'
import { formatAmount } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) return errorResponse('Admin access required', 403, ErrorCodes.AUTHORIZATION_ERROR)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('payment_status')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const petType = searchParams.get('pet_type')
    const search = searchParams.get('search')
    const today = searchParams.get('today') === 'true'
    const { page, limit, skip } = getPaginationParams(searchParams)

    await connectDB()

    const query: any = {}
    
    if (status) query.status = status
    if (paymentStatus) query.paymentStatus = paymentStatus
    if (petType) query['petDetails.type'] = petType
    
    if (today) {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const todayEnd = new Date()
      todayEnd.setHours(23, 59, 59, 999)
      query.$or = [
        { startDate: { $gte: todayStart, $lte: todayEnd } },
        { endDate: { $gte: todayStart, $lte: todayEnd } },
        { startDate: { $lte: todayStart }, endDate: { $gte: todayEnd } },
      ]
    } else if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) }
      query.endDate = { $lte: new Date(endDate) }
    }

    if (search) {
      query.$or = [
        { bookingNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'petDetails.name': { $regex: search, $options: 'i' } },
      ]
    }

    const [bookings, total, stats] = await Promise.all([
      Booking.find(query)
        .populate('user', 'name email phone')
        .populate('pet', 'name type breed')
        .populate('assignedStaff', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(query),
      Booking.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$pricing.total' },
            paidRevenue: { $sum: '$paidAmount' },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
            inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          },
        },
      ]),
    ])

    const statsData = stats[0] || {
      totalRevenue: 0, paidRevenue: 0, pending: 0, confirmed: 0, inProgress: 0, completed: 0, cancelled: 0,
    }

    return successResponse({
      bookings: bookings.map((b: any) => ({
        ...b.toObject(),
        pricing: { ...b.pricing, totalFormatted: formatAmount(b.pricing.total) },
        paidAmountFormatted: formatAmount(b.paidAmount || 0),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      stats: {
        ...statsData,
        totalRevenueFormatted: formatAmount(statsData.totalRevenue),
        paidRevenueFormatted: formatAmount(statsData.paidRevenue),
      },
    })
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) return errorResponse('Admin access required', 403, ErrorCodes.AUTHORIZATION_ERROR)

    const body = await request.json()
    const { bookingId, status, assignedStaff, adminNotes, actualCheckIn, actualCheckOut } = body

    if (!bookingId) return errorResponse('Booking ID required', 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    const updates: any = {}
    if (status) {
      updates.status = status
      if (status === 'in_progress' && !actualCheckIn) updates.actualCheckIn = new Date()
      if (status === 'completed' && !actualCheckOut) updates.actualCheckOut = new Date()
    }
    if (assignedStaff) updates.assignedStaff = assignedStaff
    if (adminNotes !== undefined) updates.adminNotes = adminNotes
    if (actualCheckIn) updates.actualCheckIn = new Date(actualCheckIn)
    if (actualCheckOut) updates.actualCheckOut = new Date(actualCheckOut)

    const booking = await Booking.findByIdAndUpdate(bookingId, { $set: updates }, { new: true })
      .populate('user', 'name email phone')
      .populate('pet', 'name type breed')

    if (!booking) return errorResponse('Booking not found', 404, ErrorCodes.NOT_FOUND)

    return successResponse(booking, 'Booking updated successfully')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
