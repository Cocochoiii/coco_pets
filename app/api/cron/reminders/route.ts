// app/api/cron/reminders/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import { Notification } from '@/models/Notification'
import { CronLog } from '@/models/System'
import { verifyCronSecret, successResponse, errorResponse, ErrorCodes } from '@/lib/api-utils'
import { sendEmail } from '@/lib/services/email'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    if (!verifyCronSecret(request)) return errorResponse('Unauthorized', 401, ErrorCodes.AUTHENTICATION_ERROR)

    await connectDB()

    const results = { processed: 0, succeeded: 0, failed: 0, details: {} as Record<string, number> }
    const now = new Date()

    // 24-hour check-in reminders
    try {
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      const tomorrowStart = new Date(tomorrow)
      tomorrowStart.setHours(0, 0, 0, 0)
      const tomorrowEnd = new Date(tomorrow)
      tomorrowEnd.setHours(23, 59, 59, 999)

      const bookings = await Booking.find({
        status: 'confirmed',
        startDate: { $gte: tomorrowStart, $lte: tomorrowEnd },
        'reminders.oneDaySent': false,
      }).populate('user')

      for (const booking of bookings) {
        results.processed++
        try {
          if (booking.user) {
            await Notification.create({
              user: (booking.user as any)._id,
              type: 'reminder',
              title: 'Check-in Tomorrow!',
              message: `${booking.petDetails.name}'s stay starts tomorrow. Please arrive between 8am-10am.`,
              data: { bookingId: booking._id, bookingNumber: booking.bookingNumber },
              channels: ['in_app', 'email', 'push'],
            })

            await sendEmail({
              to: (booking.user as any).email,
              template: 'reminder',
              data: { title: 'Check-in Tomorrow', message: `${booking.petDetails.name}'s stay starts tomorrow.` },
            })
          }

          await Booking.findByIdAndUpdate(booking._id, { $set: { 'reminders.oneDaySent': true } })
          results.succeeded++
        } catch (e) {
          results.failed++
        }
      }
      results.details.oneDayReminders = bookings.length
    } catch (e) {
      results.failed++
    }

    // 3-day advance reminders
    try {
      const threeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
      const threeDaysStart = new Date(threeDays)
      threeDaysStart.setHours(0, 0, 0, 0)
      const threeDaysEnd = new Date(threeDays)
      threeDaysEnd.setHours(23, 59, 59, 999)

      const bookings = await Booking.find({
        status: 'confirmed',
        startDate: { $gte: threeDaysStart, $lte: threeDaysEnd },
        'reminders.threeDaySent': false,
      }).populate('user')

      for (const booking of bookings) {
        results.processed++
        try {
          if (booking.user) {
            await Notification.create({
              user: (booking.user as any)._id,
              type: 'reminder',
              title: 'Upcoming Booking',
              message: `${booking.petDetails.name}'s stay is in 3 days. Remember to bring vaccination records.`,
              data: { bookingId: booking._id },
              channels: ['in_app', 'email'],
            })
          }
          await Booking.findByIdAndUpdate(booking._id, { $set: { 'reminders.threeDaySent': true } })
          results.succeeded++
        } catch (e) {
          results.failed++
        }
      }
      results.details.threeDayReminders = bookings.length
    } catch (e) {
      results.failed++
    }

    // Checkout day reminders
    try {
      const todayStart = new Date(now)
      todayStart.setHours(0, 0, 0, 0)
      const todayEnd = new Date(now)
      todayEnd.setHours(23, 59, 59, 999)

      const bookings = await Booking.find({
        status: 'in_progress',
        endDate: { $gte: todayStart, $lte: todayEnd },
        'reminders.checkOutSent': false,
      }).populate('user')

      for (const booking of bookings) {
        results.processed++
        try {
          if (booking.user) {
            await Notification.create({
              user: (booking.user as any)._id,
              type: 'reminder',
              title: 'Check-out Today',
              message: `${booking.petDetails.name} is ready for pickup! Please arrive between 4pm-6pm.`,
              data: { bookingId: booking._id },
              channels: ['in_app', 'email', 'push'],
            })
          }
          await Booking.findByIdAndUpdate(booking._id, { $set: { 'reminders.checkOutSent': true } })
          results.succeeded++
        } catch (e) {
          results.failed++
        }
      }
      results.details.checkoutReminders = bookings.length
    } catch (e) {
      results.failed++
    }

    const executionTime = Date.now() - startTime

    await CronLog.create({
      jobName: 'reminders',
      status: results.failed === 0 ? 'completed' : 'partial',
      results,
      executionTime,
      startedAt: new Date(startTime),
      completedAt: new Date(),
    })

    return successResponse({ ...results, executionTime: `${executionTime}ms` }, 'Reminders sent')
  } catch (error: any) {
    const executionTime = Date.now() - startTime

    await CronLog.create({
      jobName: 'reminders',
      status: 'failed',
      executionTime,
      errorMessage: error.message,
      startedAt: new Date(startTime),
      completedAt: new Date(),
    }).catch(() => {})

    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
