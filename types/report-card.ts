// types/report-card.ts

export interface ReportCardActivity {
  type: 'feeding' | 'walking' | 'playtime' | 'potty' | 'medication' | 'grooming' | 'nap' | 'socialization'
  time: string
  duration?: number
  notes?: string
  mood?: 'happy' | 'calm' | 'excited' | 'tired' | 'anxious'
}

export interface ReportCardMeal {
  time: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'treat'
  amount: string
  foodType?: string
  appetiteLevel: 'excellent' | 'good' | 'fair' | 'poor'
  notes?: string
}

export interface ReportCardHealth {
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

export interface ReportCardWalk {
  startTime: string
  endTime: string
  duration: number
  distance?: number
  notes?: string
}

export interface ReportCardMedia {
  type: 'photo' | 'video'
  url: string
  thumbnailUrl?: string
  caption?: string
  timestamp: string
  isHighlight?: boolean
}

export interface ReportCard {
  _id: string
  booking: {
    _id: string
    bookingNumber: string
    startDate: string
    endDate: string
    petDetails?: { name: string; type: 'cat' | 'dog' }
  }
  pet?: {
    _id: string
    name: string
    type: 'cat' | 'dog'
    breed?: string
    profileImage?: string
  }
  date: string
  staff: { _id?: string; name: string }
  activities: ReportCardActivity[]
  meals: ReportCardMeal[]
  healthObservations: ReportCardHealth
  walks: ReportCardWalk[]
  media: ReportCardMedia[]
  staffNotes?: string
  messageToParent?: string
  overallMood: 'excellent' | 'great' | 'good' | 'okay' | 'needs_attention'
  highlights: string[]
  status: 'draft' | 'completed' | 'sent'
  sentAt?: string
  viewedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ReportCardFormData {
  bookingId: string
  petId?: string
  date: string
  activities?: ReportCardActivity[]
  meals?: ReportCardMeal[]
  healthObservations?: Partial<ReportCardHealth>
  walks?: ReportCardWalk[]
  media?: ReportCardMedia[]
  messageToParent?: string
  highlights?: string[]
  overallMood?: ReportCard['overallMood']
}

export const ACTIVITY_TYPES = [
  { value: 'feeding', label: 'Feeding', icon: '🍽️' },
  { value: 'walking', label: 'Walking', icon: '🚶' },
  { value: 'playtime', label: 'Playtime', icon: '🎾' },
  { value: 'potty', label: 'Potty Break', icon: '💧' },
  { value: 'medication', label: 'Medication', icon: '💊' },
  { value: 'grooming', label: 'Grooming', icon: '✨' },
  { value: 'nap', label: 'Nap Time', icon: '😴' },
  { value: 'socialization', label: 'Socialization', icon: '🐾' }
] as const

export const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast', icon: '☀️' },
  { value: 'lunch', label: 'Lunch', icon: '🌤️' },
  { value: 'dinner', label: 'Dinner', icon: '🌙' },
  { value: 'snack', label: 'Snack', icon: '🍪' },
  { value: 'treat', label: 'Treat', icon: '🦴' }
] as const

export const MOOD_CONFIG = {
  excellent: { label: 'Excellent', color: 'emerald', emoji: '✨' },
  great: { label: 'Great', color: 'green', emoji: '😊' },
  good: { label: 'Good', color: 'blue', emoji: '🙂' },
  okay: { label: 'Okay', color: 'amber', emoji: '😐' },
  needs_attention: { label: 'Needs Attention', color: 'red', emoji: '⚠️' }
} as const
