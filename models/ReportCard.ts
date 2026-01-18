// models/ReportCard.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IReportCard extends Document {
  booking: mongoose.Types.ObjectId
  pet?: mongoose.Types.ObjectId
  date: Date
  staff: mongoose.Types.ObjectId
  activities: {
    type: 'feeding' | 'walking' | 'playtime' | 'potty' | 'medication' | 'grooming' | 'nap' | 'socialization'
    time: Date
    duration?: number
    notes?: string
    mood?: 'happy' | 'calm' | 'excited' | 'tired' | 'anxious'
  }[]
  meals: {
    time: Date
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'treat'
    amount: string
    foodType?: string
    appetiteLevel: 'excellent' | 'good' | 'fair' | 'poor'
    notes?: string
  }[]
  healthObservations: {
    overallCondition: 'excellent' | 'good' | 'fair' | 'needs_attention'
    energyLevel: number
    poopCount: number
    poopQuality?: 'normal' | 'soft' | 'hard' | 'diarrhea'
    peeCount: number
    waterIntake: 'normal' | 'low' | 'high'
    vomiting: boolean
    coughing: boolean
    limping: boolean
    scratching: boolean
    otherConcerns?: string
  }
  walks: {
    startTime: Date
    endTime: Date
    duration: number
    distance?: number
    route?: { type: string; coordinates: [number, number][] }
    pottySpots?: { type: 'pee' | 'poop'; coordinates: [number, number]; time: Date }[]
    notes?: string
  }[]
  media: {
    type: 'photo' | 'video'
    url: string
    thumbnailUrl?: string
    caption?: string
    timestamp: Date
    isHighlight?: boolean
  }[]
  staffNotes?: string
  messageToParent?: string
  overallMood: 'excellent' | 'great' | 'good' | 'okay' | 'needs_attention'
  highlights: string[]
  status: 'draft' | 'completed' | 'sent'
  sentAt?: Date
  viewedAt?: Date
  viewedBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ReportCardSchema = new Schema<IReportCard>({
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  pet: { type: Schema.Types.ObjectId, ref: 'Pet' },
  date: { type: Date, required: true },
  staff: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  activities: [{
    type: { type: String, enum: ['feeding', 'walking', 'playtime', 'potty', 'medication', 'grooming', 'nap', 'socialization'], required: true },
    time: { type: Date, required: true },
    duration: { type: Number },
    notes: { type: String },
    mood: { type: String, enum: ['happy', 'calm', 'excited', 'tired', 'anxious'] }
  }],
  meals: [{
    time: { type: Date, required: true },
    type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack', 'treat'], required: true },
    amount: { type: String, required: true },
    foodType: { type: String },
    appetiteLevel: { type: String, enum: ['excellent', 'good', 'fair', 'poor'], default: 'good' },
    notes: { type: String }
  }],
  healthObservations: {
    overallCondition: { type: String, enum: ['excellent', 'good', 'fair', 'needs_attention'], default: 'good' },
    energyLevel: { type: Number, min: 1, max: 5, default: 3 },
    poopCount: { type: Number, default: 0 },
    poopQuality: { type: String, enum: ['normal', 'soft', 'hard', 'diarrhea'] },
    peeCount: { type: Number, default: 0 },
    waterIntake: { type: String, enum: ['normal', 'low', 'high'], default: 'normal' },
    vomiting: { type: Boolean, default: false },
    coughing: { type: Boolean, default: false },
    limping: { type: Boolean, default: false },
    scratching: { type: Boolean, default: false },
    otherConcerns: { type: String }
  },
  walks: [{
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    distance: { type: Number },
    route: { type: { type: String, enum: ['LineString'] }, coordinates: { type: [[Number]] } },
    pottySpots: [{ type: { type: String, enum: ['pee', 'poop'] }, coordinates: { type: [Number] }, time: { type: Date } }],
    notes: { type: String }
  }],
  media: [{
    type: { type: String, enum: ['photo', 'video'], required: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    caption: { type: String },
    timestamp: { type: Date, default: Date.now },
    isHighlight: { type: Boolean, default: false }
  }],
  staffNotes: { type: String },
  messageToParent: { type: String },
  overallMood: { type: String, enum: ['excellent', 'great', 'good', 'okay', 'needs_attention'], default: 'good' },
  highlights: [{ type: String }],
  status: { type: String, enum: ['draft', 'completed', 'sent'], default: 'draft' },
  sentAt: { type: Date },
  viewedAt: { type: Date },
  viewedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

ReportCardSchema.index({ booking: 1, date: 1 }, { unique: true })
ReportCardSchema.index({ pet: 1, date: -1 })
ReportCardSchema.index({ status: 1, date: -1 })
ReportCardSchema.index({ staff: 1 })

ReportCardSchema.pre('save', function(next) {
  if (this.healthObservations) {
    const health = this.healthObservations
    if (health.overallCondition === 'excellent' && health.energyLevel >= 4) {
      this.overallMood = 'excellent'
    } else if (health.overallCondition === 'needs_attention' || health.vomiting || health.limping) {
      this.overallMood = 'needs_attention'
    }
  }
  next()
})

export default mongoose.models.ReportCard || mongoose.model<IReportCard>('ReportCard', ReportCardSchema)
