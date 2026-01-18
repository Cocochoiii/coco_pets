// app/api/upload/route.ts
import { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { successResponse, errorResponse, ErrorCodes } from '@/lib/api-utils'
import cloudinary, { UPLOAD_FOLDERS } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return errorResponse('Authentication required', 401, ErrorCodes.AUTHENTICATION_ERROR)
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = (formData.get('type') as string) || 'general'

    if (!file) {
      return errorResponse('No file provided', 400, ErrorCodes.VALIDATION_ERROR)
    }

    // 检查文件大小 (Cloudinary 免费版限制: 图片 10MB, 视频 100MB)
    const isVideo = file.type.startsWith('video/')
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024

    if (file.size > maxSize) {
      return errorResponse(
          `File too large. Max size: ${maxSize / 1024 / 1024}MB`,
          400,
          ErrorCodes.VALIDATION_ERROR
      )
    }

    // 检查文件类型
    const allowedTypes = [
      // 图片
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // 视频
      'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
      // 文档
      'application/pdf'
    ]

    if (!allowedTypes.includes(file.type)) {
      return errorResponse('File type not allowed', 400, ErrorCodes.VALIDATION_ERROR)
    }

    // 转换文件为 base64 data URI
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    // 确定上传文件夹
    const folder = UPLOAD_FOLDERS[type] || UPLOAD_FOLDERS.general

    // 生成唯一 public_id
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_')
    const publicId = `${nameWithoutExt}_${timestamp}_${random}`

    // 上传到 Cloudinary
    const uploadOptions: any = {
      folder,
      public_id: publicId,
      resource_type: isVideo ? 'video' : 'auto',
      overwrite: false,
    }

    // 图片优化选项
    if (!isVideo && file.type !== 'application/pdf') {
      uploadOptions.transformation = [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    }

    const result = await cloudinary.uploader.upload(dataUri, uploadOptions)

    return successResponse(
        {
          url: result.secure_url,
          publicId: result.public_id,
          filename: file.name,
          originalName: file.name,
          size: file.size,
          type: file.type,
          width: result.width,
          height: result.height,
          format: result.format,
          // 缩略图 URL
          thumbnailUrl: isVideo
              ? cloudinary.url(result.public_id, { resource_type: 'video', transformation: [{ width: 300, crop: 'scale' }, { quality: 'auto' }] })
              : cloudinary.url(result.public_id, { transformation: [{ width: 300, height: 300, crop: 'fill' }, { quality: 'auto' }] })
        },
        'File uploaded successfully'
    )
  } catch (error: any) {
    console.error('Upload error:', error)
    return errorResponse(error.message || 'Upload failed', 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return errorResponse('Authentication required', 401, ErrorCodes.AUTHENTICATION_ERROR)
    }

    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')
    const resourceType = searchParams.get('resourceType') || 'image'

    if (!publicId) {
      return errorResponse('Public ID required', 400, ErrorCodes.VALIDATION_ERROR)
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType as 'image' | 'video' | 'raw'
    })

    if (result.result === 'ok') {
      return successResponse(null, 'File deleted successfully')
    } else {
      return errorResponse('File not found or already deleted', 404, ErrorCodes.NOT_FOUND)
    }
  } catch (error: any) {
    console.error('Delete error:', error)
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return errorResponse('Authentication required', 401, ErrorCodes.AUTHENTICATION_ERROR)
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'general'

    const folder = UPLOAD_FOLDERS[type] || UPLOAD_FOLDERS.general

    const result = await cloudinary.search
        .expression(`folder:${folder}`)
        .sort_by('created_at', 'desc')
        .max_results(50)
        .execute()

    const files = result.resources.map((file: any) => ({
      publicId: file.public_id,
      url: file.secure_url,
      filename: file.filename,
      format: file.format,
      size: file.bytes,
      width: file.width,
      height: file.height,
      createdAt: file.created_at,
      resourceType: file.resource_type
    }))

    return successResponse(files, 'Files listed successfully')
  } catch (error: any) {
    console.error('List error:', error)
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}