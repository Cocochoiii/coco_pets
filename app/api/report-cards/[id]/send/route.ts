// app/api/report-cards/[id]/send/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import ReportCard from '@/models/ReportCard'
import Booking from '@/models/Booking'
import { Notification } from '@/models/Notification'
import { verifyStaff } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-utils'
import { sendDailyReport } from '@/lib/services/email'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const auth = await verifyStaff(request)
    if (!auth) return errorResponse('Staff access required', 403, ErrorCodes.AUTHORIZATION_ERROR)

    await connectDB()

    const report = await ReportCard.findById(id)
        .populate('pet', 'name type breed')
        .populate('booking', 'bookingNumber user customer')

    if (!report) return errorResponse('Report card not found', 404, ErrorCodes.NOT_FOUND)
    if (report.status === 'sent') return errorResponse('Report card already sent', 400, ErrorCodes.VALIDATION_ERROR)

    // Update status
    report.status = 'sent'
    report.sentAt = new Date()
    await report.save()

    const booking = report.booking as any
    const pet = report.pet as any

    // Create in-app notification
    if (booking.user) {
      await Notification.create({
        user: booking.user,
        type: 'system',
        title: `Daily Report for ${pet.name}`,
        message: `Today's report card for ${pet.name} is ready! See how their day went.`,
        data: { reportId: report._id, petName: pet.name, date: report.date },
        channels: ['in_app', 'email'],
        status: 'pending',
        actionUrl: `/dashboard?tab=reports&report=${report._id}`
      })
    }

    // Send email
    const emailResult = await sendDailyReport(booking.customer.email, {
      petName: pet.name,
      petType: pet.type,
      date: report.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      summary: report.messageToParent || `${pet.name} had a ${report.overallMood} day today!`,
      overallMood: report.overallMood,
      highlights: report.highlights,
      photos: report.media.filter((m: any) => m.type === 'photo').slice(0, 4).map((m: any) => m.url),
      reportId: report._id.toString()
    })

    return successResponse({
      report: { _id: report._id, status: report.status, sentAt: report.sentAt },
      emailSent: emailResult.success
    }, 'Report card sent successfully')
  } catch (error: any) {
    console.error('Send report card error:', error)
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}