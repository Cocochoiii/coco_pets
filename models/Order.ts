// models/Order.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IOrder extends Document {
  orderId: string
  booking?: mongoose.Types.ObjectId
  user?: mongoose.Types.ObjectId
  customer: {
    email: string
    name: string
    phone?: string
  }
  stripeSessionId?: string
  stripePaymentIntentId?: string
  stripeCustomerId?: string
  amounts: {
    subtotal: number
    discount: number
    tax: number
    total: number
    paid: number
    refunded: number
  }
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'partially_refunded' | 'expired' | 'cancelled'
  paymentType: 'full' | 'deposit'
  refunds: Array<{
    refundId: string
    stripeRefundId: string
    amount: number
    reason: string
    status: string
    createdAt: Date
  }>
  receiptUrl?: string
  errorMessage?: string
  expiresAt?: Date
  paidAt?: Date
  refundedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true },
  booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  customer: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
  },
  stripeSessionId: { type: String },
  stripePaymentIntentId: { type: String },
  stripeCustomerId: { type: String },
  amounts: {
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    paid: { type: Number, default: 0 },
    refunded: { type: Number, default: 0 },
  },
  status: { type: String, enum: ['pending', 'processing', 'paid', 'failed', 'refunded', 'partially_refunded', 'expired', 'cancelled'], default: 'pending' },
  paymentType: { type: String, enum: ['full', 'deposit'], default: 'full' },
  refunds: [{
    refundId: { type: String, required: true },
    stripeRefundId: { type: String, required: true },
    amount: { type: Number, required: true },
    reason: { type: String },
    status: { type: String },
    createdAt: { type: Date, default: Date.now },
  }],
  receiptUrl: { type: String },
  errorMessage: { type: String },
  expiresAt: { type: Date },
  paidAt: { type: Date },
  refundedAt: { type: Date },
}, { timestamps: true })

OrderSchema.index({ orderId: 1 })
OrderSchema.index({ booking: 1 })
OrderSchema.index({ user: 1 })
OrderSchema.index({ status: 1 })
OrderSchema.index({ stripeSessionId: 1 })

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
