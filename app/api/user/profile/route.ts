import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { verifyAuth } from '@/lib/auth'
import { User } from '@/models'

// PUT - Update user profile
export async function PUT(req: NextRequest) {
    try {
        const auth = await verifyAuth(req)
        if (!auth) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { name, phone, address, preferences } = body

        await connectDB()

        const updatedUser = await User.findByIdAndUpdate(
            auth.userId,
            {
                $set: {
                    ...(name && { name }),
                    ...(phone && { phone }),
                    ...(address && { address }),
                    ...(preferences && { preferences })
                }
            },
            { new: true }
        ).select('-password')

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, user: updatedUser })
    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 })
    }
}

// GET - Get user profile
export async function GET(req: NextRequest) {
    try {
        const auth = await verifyAuth(req)
        if (!auth) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        }

        await connectDB()

        const userData = await User.findById(auth.userId).select('-password')

        if (!userData) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, user: userData })
    } catch (error) {
        console.error('Error fetching profile:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 })
    }
}