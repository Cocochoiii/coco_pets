import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth'
import mongoose from 'mongoose'

// Pet Schema for user's pets
const UserPetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['cat', 'dog'], required: true },
    breed: { type: String, required: true },
    age: { type: String },
    weight: { type: Number },
    gender: { type: String, enum: ['male', 'female'] },
    vaccinated: { type: Boolean, default: false },
    neutered: { type: Boolean, default: false },
    specialNeeds: { type: String },
    medications: { type: String },
    feedingInstructions: { type: String },
    emergencyContact: { type: String },
    image: { type: String },
}, { timestamps: true })

const UserPet = mongoose.models.UserPet || mongoose.model('UserPet', UserPetSchema)

// GET - Get all user's pets
export async function GET(req: NextRequest) {
    try {
        const user = await verifyToken(req)
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()
        const pets = await UserPet.find({ userId: user.id }).sort({ createdAt: -1 })

        return NextResponse.json({ success: true, pets })
    } catch (error) {
        console.error('Error fetching pets:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch pets' }, { status: 500 })
    }
}

// POST - Add new pet
export async function POST(req: NextRequest) {
    try {
        const user = await verifyToken(req)
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { name, type, breed, age, weight, gender, vaccinated, neutered, specialNeeds, medications, feedingInstructions, emergencyContact } = body

        if (!name || !type || !breed) {
            return NextResponse.json({ success: false, error: 'Name, type, and breed are required' }, { status: 400 })
        }

        await connectDB()

        const pet = await UserPet.create({
            userId: user.id,
            name,
            type,
            breed,
            age,
            weight: weight ? Number(weight) : undefined,
            gender,
            vaccinated,
            neutered,
            specialNeeds,
            medications,
            feedingInstructions,
            emergencyContact
        })

        return NextResponse.json({ success: true, pet })
    } catch (error) {
        console.error('Error creating pet:', error)
        return NextResponse.json({ success: false, error: 'Failed to create pet' }, { status: 500 })
    }
}
