// app/api/chat/route.ts
import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import { ChatMessage, ChatConversation } from '@/models/Chat'
import { verifyAuth, verifyStaff } from '@/lib/auth'
import { successResponse, errorResponse, sanitizeInput, getPaginationParams, ErrorCodes } from '@/lib/api-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversation_id')
    const { page, limit, skip } = getPaginationParams(searchParams)

    await connectDB()

    if (conversationId) {
      const [messages, total] = await Promise.all([
        ChatMessage.find({ conversation: conversationId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        ChatMessage.countDocuments({ conversation: conversationId }),
      ])
      return successResponse({ messages: messages.reverse(), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
    }

    const auth = await verifyAuth(request)
    const isStaff = auth?.user.role === 'admin' || auth?.user.role === 'staff'
    const query: any = !isStaff && auth ? { user: auth.userId } : {}

    const [conversations, total] = await Promise.all([
      ChatConversation.find(query).sort({ lastMessageAt: -1 }).skip(skip).limit(limit).populate('user', 'name email avatar').populate('assignedTo', 'name'),
      ChatConversation.countDocuments(query),
    ])

    return successResponse({ conversations, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, content, contentType = 'text', visitorInfo } = body

    if (!content) return errorResponse('Content required', 400, ErrorCodes.VALIDATION_ERROR)

    await connectDB()

    const auth = await verifyAuth(request)
    let conversation

    if (conversationId) {
      conversation = await ChatConversation.findById(conversationId)
      if (!conversation) return errorResponse('Conversation not found', 404, ErrorCodes.NOT_FOUND)
    } else {
      conversation = await ChatConversation.create({ user: auth?.userId, visitorInfo: !auth?.userId ? visitorInfo : undefined, status: 'active', source: 'website' })
    }

    const message = await ChatMessage.create({
      conversation: conversation._id,
      sender: auth?.userId,
      senderType: auth?.user.role === 'admin' || auth?.user.role === 'staff' ? 'staff' : 'customer',
      senderName: auth?.user.name || visitorInfo?.name || 'Visitor',
      content: sanitizeInput(content),
      contentType,
    })

    await ChatConversation.findByIdAndUpdate(conversation._id, {
      $inc: { messageCount: 1, unreadCount: auth?.user.role !== 'admin' && auth?.user.role !== 'staff' ? 1 : 0 },
      $set: { lastMessageAt: new Date(), lastMessage: content.substring(0, 100) },
    })

    return successResponse({ message, conversationId: conversation._id }, 'Message sent')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyStaff(request)
    if (!auth) return errorResponse('Staff access required', 403, ErrorCodes.AUTHORIZATION_ERROR)

    const body = await request.json()
    const { conversationId, status, assignedTo, priority } = body

    if (!conversationId) return errorResponse('Conversation ID required', 400)

    await connectDB()

    const updates: any = {}
    if (status) { updates.status = status; if (status === 'closed') updates.closedAt = new Date() }
    if (assignedTo) updates.assignedTo = assignedTo
    if (priority) updates.priority = priority

    const conversation = await ChatConversation.findByIdAndUpdate(conversationId, { $set: updates }, { new: true })
    if (!conversation) return errorResponse('Conversation not found', 404)

    return successResponse(conversation, 'Conversation updated')
  } catch (error: any) {
    return errorResponse(error.message, 500, ErrorCodes.INTERNAL_ERROR)
  }
}
