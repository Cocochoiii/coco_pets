// app/api/availability/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Availability } from '@/models/Notification'
import { verifyAdmin } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-utils'
import config from '@/config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const petType = searchParams.get('pet_type')
    const month = searchParams.get('month')

    await connectDB()

    let start: Date, end: Date

    if (month) {
      const [year, monthNum] = month.split('-').map(Number)
      start = new Date(year, monthNum - 1, 1)
      end = new Date(year, monthNum, 0)
    } else if (startDate && endDate) {
      start = new Date(startDate)
      end = new Date(endDate)
    } else {
      start = new Date()
      end = new Date()
      end.setDate(end.getDate() + 60)
    }

    const records = await Availability.find({ date: { $gte: start, $lte: end }, ...(petType && { petType }) }).sort({ date: 1 })

    const availabilityMap: Record<string, any> = {}
    const current = new Date(start)
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0]
      availabilityMap[dateStr] = {
        date: dateStr,
        cat: { total: config.capacity.cats.default, booked: 0, blocked: 0, available: config.capacity.cats.default, isBlocked: false },
        dog: { total: config.capacity.dogs.default, booked: 0, blocked: 0, available: config.capacity.dogs.default, isBlocked: false },
      }
      current.setDate(current.getDate() + 1)
    }

    for (const record of records) {
      const dateStr = record.date.toISOString().split('T')[0]
      if (availabilityMap[dateStr]) {
        const type = record.petType as 'cat' | 'dog'
        availabilityMap[dateStr][type] = {
          total: record.capacity.total, booked: record.capacity.booked, blocked: record.capacity.blocked,
          available: record.capacity.total - record.capacity.booked - record.capacity.blocked,
          pricing: record.pricing, isBlocked: record.isBlocked, blockReason: record.blockReason, notes: record.notes,
        }
      }
    }

    return successResponse({ availability: Object.values(availabilityMap), range: { start: start.toISOString(), end: end.toISOString() } })
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request)
    if (!auth) return errorResponse('Admin access required', 403, ErrorCodes.AUTHORIZATION_ERROR)

    const body = await request.json()
    const { date, petType, capacity, isBlocked, blockReason, pricing, notes } = body

    if (!date || !petType) return errorResponse('Date and pet type required', 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)

    const update: any = {}
    if (capacity) update.capacity = capacity
    if (typeof isBlocked === 'boolean') update.isBlocked = isBlocked
    if (blockReason !== undefined) update.blockReason = blockReason
    if (pricing) update.pricing = pricing
    if (notes !== undefined) update.notes = notes

    const availability = await Availability.findOneAndUpdate({ date: targetDate, petType }, { $set: update }, { new: true, upsert: true })

    return successResponse(availability, 'Availability updated')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
