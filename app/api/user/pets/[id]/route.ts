import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { verifyAuth } from '@/lib/auth'
import mongoose from 'mongoose'

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

// GET - Get a single pet
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(req)
        if (!auth) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        await connectDB()

        const pet = await UserPet.findOne({
            _id: id,
            userId: auth.userId
        })

        if (!pet) {
            return NextResponse.json({ success: false, error: 'Pet not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, pet })
    } catch (error) {
        console.error('Error fetching pet:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch pet' }, { status: 500 })
    }
}

// DELETE - Delete a pet
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(req)
        if (!auth) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        await connectDB()

        const pet = await UserPet.findOneAndDelete({
            _id: id,
            userId: auth.userId
        })

        if (!pet) {
            return NextResponse.json({ success: false, error: 'Pet not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: 'Pet deleted successfully' })
    } catch (error) {
        console.error('Error deleting pet:', error)
        return NextResponse.json({ success: false, error: 'Failed to delete pet' }, { status: 500 })
    }
}

// PUT - Update a pet
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await verifyAuth(req)
        if (!auth) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await req.json()

        await connectDB()

        const pet = await UserPet.findOneAndUpdate(
            { _id: id, userId: auth.userId },
            { $set: body },
            { new: true }
        )

        if (!pet) {
            return NextResponse.json({ success: false, error: 'Pet not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, pet })
    } catch (error) {
        console.error('Error updating pet:', error)
        return NextResponse.json({ success: false, error: 'Failed to update pet' }, { status: 500 })
    }
}