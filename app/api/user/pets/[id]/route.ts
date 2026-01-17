import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { verifyToken } from '@/lib/auth'
import mongoose from 'mongoose'

const UserPetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['cat', 'dog'], required: true },
    breed: { type: String, required: true },
}, { timestamps: true })

const UserPet = mongoose.models.UserPet || mongoose.model('UserPet', UserPetSchema)

// DELETE - Delete a pet
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await verifyToken(req)
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()
        
        const pet = await UserPet.findOneAndDelete({
            _id: params.id,
            userId: user.id
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
    { params }: { params: { id: string } }
) {
    try {
        const user = await verifyToken(req)
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        await connectDB()

        const pet = await UserPet.findOneAndUpdate(
            { _id: params.id, userId: user.id },
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
