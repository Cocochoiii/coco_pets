// models/Pet.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IPet extends Document {
  owner: mongoose.Types.ObjectId
  name: string
  type: 'cat' | 'dog'
  breed?: string
  color?: string
  age?: string
  dateOfBirth?: Date
  weight?: number
  size?: 'small' | 'medium' | 'large'
  gender?: 'male' | 'female'
  health: {
    vaccinated: boolean
    spayedNeutered: boolean
    microchipped: boolean
    microchipNumber?: string
  }
  vaccinations: Array<{
    name: string
    date: Date
    expiresAt?: Date
    verified: boolean
  }>
  specialNeeds?: string
  dietaryRequirements?: string
  medications?: string[]
  allergies?: string[]
  behaviorNotes?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  veterinarian?: {
    name: string
    clinic: string
    phone: string
  }
  images: string[]
  profileImage?: string
  preferences: {
    favoriteActivities: string[]
    fearsTriggers: string[]
    socialWithDogs: boolean
    socialWithCats: boolean
    socialWithPeople: boolean
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const PetSchema = new Schema<IPet>({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['cat', 'dog'], required: true },
  breed: { type: String, trim: true },
  color: { type: String, trim: true },
  age: { type: String },
  dateOfBirth: { type: Date },
  weight: { type: Number },
  size: { type: String, enum: ['small', 'medium', 'large'] },
  gender: { type: String, enum: ['male', 'female'] },
  health: {
    vaccinated: { type: Boolean, default: false },
    spayedNeutered: { type: Boolean, default: false },
    microchipped: { type: Boolean, default: false },
    microchipNumber: { type: String },
  },
  vaccinations: [{
    name: { type: String, required: true },
    date: { type: Date, required: true },
    expiresAt: { type: Date },
    verified: { type: Boolean, default: false },
  }],
  specialNeeds: { type: String },
  dietaryRequirements: { type: String },
  medications: [{ type: String }],
  allergies: [{ type: String }],
  behaviorNotes: { type: String },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relationship: { type: String },
  },
  veterinarian: {
    name: { type: String },
    clinic: { type: String },
    phone: { type: String },
  },
  images: [{ type: String }],
  profileImage: { type: String },
  preferences: {
    favoriteActivities: [{ type: String }],
    fearsTriggers: [{ type: String }],
    socialWithDogs: { type: Boolean, default: true },
    socialWithCats: { type: Boolean, default: true },
    socialWithPeople: { type: Boolean, default: true },
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

PetSchema.index({ owner: 1 })
PetSchema.index({ type: 1, isActive: 1 })

export default mongoose.models.Pet || mongoose.model<IPet>('Pet', PetSchema)
