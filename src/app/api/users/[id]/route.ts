import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    const body = await request.json()
    const { approvalStatus, profilePicture, ...otherFields } = body

    // Build update data object
    const updateData: any = {}

    // Handle approval status
    if (approvalStatus) {
      // Validate approval status
      if (!['PENDING', 'APPROVED', 'REJECTED'].includes(approvalStatus)) {
        return NextResponse.json(
          { error: 'Invalid approval status' },
          { status: 400 },
        )
      }
      updateData.approvalStatus = approvalStatus
    }

    // Handle profile picture
    if (profilePicture !== undefined) {
      updateData.profilePicture = profilePicture
    }

    // Handle any other fields
    Object.assign(updateData, otherFields)

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        mobile: true,
        approvalStatus: true,
        profilePicture: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    const body = await request.json()

    // Remove fields that shouldn't be updated directly
    const {
      id: _id,
      createdAt,
      updatedAt,
      password,
      otp,
      otpExpiry,
      ...updateData
    } = body

    // Convert age to number if it's a string
    if (updateData.age) {
      updateData.age = parseInt(updateData.age)
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 },
    )
  }
}
