// app/api/report-cards/[id]/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import ReportCard from '@/models/ReportCard'
import Booking from '@/models/Booking'
import { verifyAuth, verifyStaff, verifyAdmin } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-utils'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Authentication required', 401, ErrorCodes.AUTHENTICATION_ERROR)

    await connectDB()

    const report = await ReportCard.findById(params.id)
      .populate('pet', 'name type breed profileImage images')
      .populate('booking', 'bookingNumber startDate endDate petDetails user customer')
      .populate('staff', 'name')
      .lean()

    if (!report) return errorResponse('Report card not found', 404, ErrorCodes.NOT_FOUND)

    // Check access for customers
    if (auth.user.role !== 'admin' && auth.user.role !== 'staff') {
      const booking = await Booking.findById(report.booking._id || report.booking)
      if (!booking || booking.user?.toString() !== auth.userId) {
        return errorResponse('Access denied', 403, ErrorCodes.AUTHORIZATION_ERROR)
      }
      if (report.status !== 'sent') {
        return errorResponse('Report not yet available', 403, ErrorCodes.AUTHORIZATION_ERROR)
      }

      // Mark as viewed
      await ReportCard.findByIdAndUpdate(params.id, { viewedAt: new Date(), viewedBy: auth.userId })
    }

    return successResponse(report)
  } catch (error: any) {
    console.error('Get report card error:', error)
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await verifyStaff(request)
    if (!auth) return errorResponse('Staff access required', 403, ErrorCodes.AUTHORIZATION_ERROR)

    await connectDB()

    const report = await ReportCard.findById(params.id)
    if (!report) return errorResponse('Report card not found', 404, ErrorCodes.NOT_FOUND)

    // Cannot edit sent reports unless admin
    if (report.status === 'sent' && auth.user.role !== 'admin') {
      return errorResponse('Cannot edit sent report cards', 400, ErrorCodes.VALIDATION_ERROR)
    }

    const body = await request.json()
    const allowedUpdates = ['activities', 'meals', 'healthObservations', 'walks', 'media', 'staffNotes', 'messageToParent', 'highlights', 'overallMood', 'status']

    const updates: any = {}
    for (const key of allowedUpdates) {
      if (body[key] !== undefined) updates[key] = body[key]
    }

    // If marking as sent, record time
    if (updates.status === 'sent' && report.status !== 'sent') {
      updates.sentAt = new Date()
    }

    const updated = await ReportCard.findByIdAndUpdate(params.id, { $set: updates }, { new: true })
      .populate('pet', 'name type breed profileImage')
      .populate('booking', 'bookingNumber startDate endDate petDetails')
      .populate('staff', 'name')

    return successResponse(updated, 'Report card updated')
  } catch (error: any) {
    console.error('Update report card error:', error)
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) return errorResponse('Admin access required', 403, ErrorCodes.AUTHORIZATION_ERROR)

    await connectDB()

    const report = await ReportCard.findByIdAndDelete(params.id)
    if (!report) return errorResponse('Report card not found', 404, ErrorCodes.NOT_FOUND)

    return successResponse({ deleted: true }, 'Report card deleted')
  } catch (error: any) {
    console.error('Delete report card error:', error)
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
