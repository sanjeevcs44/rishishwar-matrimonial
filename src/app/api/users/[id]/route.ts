import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()

    console.log('PUT request body:', JSON.stringify(body, null, 2))

    // Remove fields that shouldn't be updated directly
    const {
      id: _id,
      createdAt,
      updatedAt,
      approvedAt,
      approvedBy,
      password,
      otp,
      otpExpiry,
      ...updateData
    } = body

    // Convert age to number if it's a string
    if (updateData.age) {
      updateData.age = parseInt(updateData.age)
    }

    // Convert dateOfBirth to Date object if it's a string
    if (updateData.dateOfBirth && typeof updateData.dateOfBirth === 'string') {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth)
    }

    console.log(
      'Update data after processing:',
      JSON.stringify(updateData, null, 2),
    )

    // Validate and clean updateData - remove any undefined or invalid fields
    const cleanedData: any = {}
    const validFields = [
      'firstName',
      'lastName',
      'email',
      'mobile',
      'age',
      'gender',
      'fatherOrHusbandName',
      'motherName',
      'maritalStatus',
      'education',
      'gotra',
      'motherGotra',
      'profession',
      'yearlyIncome',
      'state',
      'district',
      'currentAddress',
      'ancestralVillage',
      'dateOfBirth',
      'profilePicture',
      'bio',
      'height',
      'complexion',
      'assignedVillage',
      'manglik',
      'birthTime',
      'birthPlace',
      'nakshatra',
      'rashi',
      'gana',
      'nadi',
      'role',
      'approvalStatus',
      'familyId',
    ]

    for (const key of validFields) {
      if (updateData[key] !== undefined) {
        cleanedData[key] = updateData[key]
      }
    }

    console.log('Cleaned data:', JSON.stringify(cleanedData, null, 2))

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id },
      data: cleanedData,
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error: any) {
    console.error('Error updating user profile:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Failed to update profile', details: error.message },
      { status: 500 },
    )
  }
}
