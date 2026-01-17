// models/Chat.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IChatMessage extends Document {
  conversation: mongoose.Types.ObjectId
  sender?: mongoose.Types.ObjectId
  senderType: 'customer' | 'admin' | 'staff' | 'system' | 'bot'
  senderName: string
  content: string
  contentType: 'text' | 'image' | 'file' | 'system'
  attachments?: Array<{ url: string; type: string; name: string }>
  readAt?: Date
  createdAt: Date
}

const ChatMessageSchema = new Schema<IChatMessage>({
  conversation: { type: Schema.Types.ObjectId, ref: 'ChatConversation', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  senderType: { type: String, enum: ['customer', 'admin', 'staff', 'system', 'bot'], required: true },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  contentType: { type: String, enum: ['text', 'image', 'file', 'system'], default: 'text' },
  attachments: [{
    url: { type: String },
    type: { type: String },
    name: { type: String },
  }],
  readAt: { type: Date },
}, { timestamps: true })

ChatMessageSchema.index({ conversation: 1, createdAt: -1 })

export const ChatMessage = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema)

export interface IChatConversation extends Document {
  user?: mongoose.Types.ObjectId
  booking?: mongoose.Types.ObjectId
  visitorInfo?: { email: string; name: string; phone?: string }
  status: 'active' | 'pending' | 'resolved' | 'closed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  assignedTo?: mongoose.Types.ObjectId
  tags: string[]
  messageCount: number
  unreadCount: number
  lastMessageAt?: Date
  lastMessage?: string
  closedAt?: Date
  source: 'website' | 'mobile' | 'email'
  createdAt: Date
  updatedAt: Date
}

const ChatConversationSchema = new Schema<IChatConversation>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
  visitorInfo: {
    email: { type: String },
    name: { type: String },
    phone: { type: String },
  },
  status: { type: String, enum: ['active', 'pending', 'resolved', 'closed'], default: 'active' },
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  tags: [{ type: String }],
  messageCount: { type: Number, default: 0 },
  unreadCount: { type: Number, default: 0 },
  lastMessageAt: { type: Date },
  lastMessage: { type: String },
  closedAt: { type: Date },
  source: { type: String, enum: ['website', 'mobile', 'email'], default: 'website' },
}, { timestamps: true })

ChatConversationSchema.index({ user: 1 })
ChatConversationSchema.index({ status: 1, lastMessageAt: -1 })
ChatConversationSchema.index({ assignedTo: 1 })

export const ChatConversation = mongoose.models.ChatConversation || mongoose.model<IChatConversation>('ChatConversation', ChatConversationSchema)

export default ChatMessage
