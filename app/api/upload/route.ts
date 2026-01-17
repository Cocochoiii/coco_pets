// app/api/upload/route.ts
import { NextRequest } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { verifyAuth } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-utils'
import config from '@/config'

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads')

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Authentication required', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string || 'general'

    if (!file) return errorResponse('No file provided', 400, ErrorCodes.VALIDATION_ERROR)

    if (file.size > config.upload.maxFileSize) {
      return errorResponse(`File too large. Max size: ${config.upload.maxFileSize / 1024 / 1024}MB`, 400, ErrorCodes.VALIDATION_ERROR)
    }

    const isImage = config.upload.allowedImageTypes.includes(file.type)
    const isDoc = config.upload.allowedDocTypes.includes(file.type)
    
    if (!isImage && !isDoc) return errorResponse('File type not allowed', 400, ErrorCodes.VALIDATION_ERROR)

    const typeDir = path.join(UPLOAD_DIR, type)
    if (!existsSync(typeDir)) await mkdir(typeDir, { recursive: true })

    const ext = path.extname(file.name)
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const filename = `${type}_${timestamp}_${random}${ext}`
    const filepath = path.join(typeDir, filename)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    const url = `/uploads/${type}/${filename}`

    return successResponse({ url, filename, originalName: file.name, size: file.size, type: file.type }, 'File uploaded successfully')
  } catch (error: any) {
    console.error('Upload error:', error)
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) return errorResponse('Authentication required', 401, ErrorCodes.AUTHENTICATION_ERROR)

    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get('url')

    if (!fileUrl) return errorResponse('File URL required', 400, ErrorCodes.VALIDATION_ERROR)
    if (!fileUrl.startsWith('/uploads/')) return errorResponse('Invalid file path', 400, ErrorCodes.VALIDATION_ERROR)

    const filepath = path.join(process.cwd(), 'public', fileUrl)
    
    if (existsSync(filepath)) {
      await unlink(filepath)
      return successResponse(null, 'File deleted successfully')
    } else {
      return errorResponse('File not found', 404, ErrorCodes.NOT_FOUND)
    }
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
