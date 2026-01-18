// app/api/report-cards/booking/[bookingId]/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import ReportCard from '@/models/ReportCard'
import Booking from '@/models/Booking'
import { verifyAuth } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-utils'

interface RouteParams {
  params: { bookingId: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Authentication required', 401, ErrorCodes.AUTHENTICATION_ERROR)

    await connectDB()

    const booking = await Booking.findById(params.bookingId)
    if (!booking) return errorResponse('Booking not found', 404, ErrorCodes.NOT_FOUND)

    // Check access for customers
    if (auth.user.role !== 'admin' && auth.user.role !== 'staff') {
      if (booking.user?.toString() !== auth.userId) {
        return errorResponse('Access denied', 403, ErrorCodes.AUTHORIZATION_ERROR)
      }
    }

    const query: any = { booking: params.bookingId }
    if (auth.user.role !== 'admin' && auth.user.role !== 'staff') {
      query.status = 'sent'
    }

    const reports = await ReportCard.find(query)
      .populate('pet', 'name type breed profileImage')
      .populate('staff', 'name')
      .sort({ date: -1 })
      .lean()

    // Calculate summary
    const summary = {
      totalReports: reports.length,
      averageMood: calculateAverageMood(reports),
      totalPhotos: reports.reduce((sum, r) => sum + (r.media?.filter((m: any) => m.type === 'photo').length || 0), 0),
      totalWalks: reports.reduce((sum, r) => sum + (r.walks?.length || 0), 0),
      totalWalkMinutes: reports.reduce((sum, r) => sum + (r.walks?.reduce((wSum: number, w: any) => wSum + (w.duration || 0), 0) || 0), 0)
    }

    return successResponse({
      booking: {
        _id: booking._id,
        bookingNumber: booking.bookingNumber,
        petName: booking.petDetails.name,
        petType: booking.petDetails.type,
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.status
      },
      reports,
      summary
    })
  } catch (error: any) {
    console.error('Get booking reports error:', error)
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

function calculateAverageMood(reports: any[]): string {
  if (reports.length === 0) return 'N/A'
  const moodScores: Record<string, number> = { excellent: 5, great: 4, good: 3, okay: 2, needs_attention: 1 }
  const totalScore = reports.reduce((sum, r) => sum + (moodScores[r.overallMood] || 3), 0)
  const avgScore = totalScore / reports.length
  if (avgScore >= 4.5) return 'Excellent'
  if (avgScore >= 3.5) return 'Great'
  if (avgScore >= 2.5) return 'Good'
  if (avgScore >= 1.5) return 'Okay'
  return 'Needs Attention'
}
