// app/api/pets/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import Pet from '@/models/Pet'
import { verifyAuth } from '@/lib/auth'
import { successResponse, errorResponse, validateRequired, sanitizeInput, getPaginationParams, ErrorCodes } from '@/lib/api-utils'
import { petsData } from '@/lib/pets'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const gallery = searchParams.get('gallery') === 'true'
    const { page, limit, skip } = getPaginationParams(searchParams)

    // Return static gallery data
    if (gallery) {
      let pets = petsData
      if (type) pets = pets.filter(p => p.type === type)
      return successResponse({ pets })
    }

    // Return user's pets from database
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Not authenticated', 401, ErrorCodes.AUTHENTICATION_ERROR)

    await connectDB()

    const query: any = { owner: auth.userId, isActive: true }
    if (type) query.type = type

    const [pets, total] = await Promise.all([
      Pet.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Pet.countDocuments(query),
    ])

    return successResponse({
      pets,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Not authenticated', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const body = await request.json()
    const validationError = validateRequired(body, ['name', 'type'])
    if (validationError) return errorResponse(validationError, 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    const pet = await Pet.create({
      ...body,
      owner: auth.userId,
      name: sanitizeInput(body.name),
      breed: body.breed ? sanitizeInput(body.breed) : undefined,
    })

    return successResponse({ pet }, 'Pet added successfully', 201)
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Not authenticated', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const body = await request.json()
    const { petId, ...updates } = body

    if (!petId) return errorResponse('Pet ID required', 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    const pet = await Pet.findOneAndUpdate(
      { _id: petId, owner: auth.userId },
      { $set: updates },
      { new: true }
    )

    if (!pet) return errorResponse('Pet not found', 404, ErrorCodes.NOT_FOUND)

    return successResponse({ pet }, 'Pet updated')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Not authenticated', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const { searchParams } = new URL(request.url)
    const petId = searchParams.get('id')

    if (!petId) return errorResponse('Pet ID required', 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    await Pet.findOneAndUpdate({ _id: petId, owner: auth.userId }, { isActive: false })

    return successResponse(null, 'Pet removed')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
