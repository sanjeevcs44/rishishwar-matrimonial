import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      firstName,
      lastName,
      age,
      gender,
      bio,
      education,
      profession,
      state,
      district,
      currentAddress,
      ancestralVillage,
      gotra,
      motherName,
      motherGotra,
      maritalStatus,
      fatherOrHusbandName,
      dateOfBirth,
      profilePicture,
      manglik,
      birthTime,
      birthPlace,
    } = body

    // Validation
    if (!userId || !firstName || !lastName || !age || !gender) {
      return NextResponse.json(
        { error: 'Required fields: First Name, Last Name, Age, Gender' },
        { status: 400 },
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Convert Hindi marital status to English enum if provided
    const maritalStatusMap: { [key: string]: string } = {
      अविवाहित: 'UNMARRIED',
      विवाहित: 'MARRIED',
      तलाकशुदा: 'DIVORCED',
      विधवा: 'WIDOWED',
      विधुर: 'WIDOWED',
      'विधवा/विधुर': 'WIDOWED',
    }
    const normalizedMaritalStatus = maritalStatus
      ? maritalStatusMap[maritalStatus] || maritalStatus
      : existingUser.maritalStatus

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        age: parseInt(age),
        dateOfBirth: dateOfBirth
          ? new Date(dateOfBirth)
          : existingUser.dateOfBirth,
        gender,
        bio: bio || null,
        education: education || null,
        profession: profession || null,
        state: state || existingUser.state,
        district: district || existingUser.district,
        currentAddress: currentAddress || existingUser.currentAddress,
        ancestralVillage: ancestralVillage || existingUser.ancestralVillage,
        gotra: gotra || null,
        motherName: motherName || null,
        motherGotra: motherGotra || null,
        maritalStatus: normalizedMaritalStatus,
        fatherOrHusbandName:
          fatherOrHusbandName || existingUser.fatherOrHusbandName,
        profilePicture:
          profilePicture !== undefined
            ? profilePicture
            : existingUser.profilePicture,
        manglik: manglik !== undefined ? manglik : existingUser.manglik,
        birthTime: birthTime !== undefined ? birthTime : existingUser.birthTime,
        birthPlace:
          birthPlace !== undefined ? birthPlace : existingUser.birthPlace,
      },
    })

    // Return user without password and OTP
    const { password: _, otp: __, ...userWithoutSensitiveData } = updatedUser

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: userWithoutSensitiveData,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
