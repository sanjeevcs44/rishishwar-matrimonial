import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get excludeId from query params to exclude current user
    const { searchParams } = new URL(request.url)
    const excludeId = searchParams.get('excludeId')
    const roleFilter = searchParams.get('role')
    const idFilter = searchParams.get('id')

    // Build where clause
    const whereClause: any = {}

    if (excludeId) {
      whereClause.id = { not: excludeId }
    }

    if (idFilter) {
      whereClause.id = idFilter
    }

    if (roleFilter) {
      whereClause.role = roleFilter
    }

    // Fetch all users based on filters
    const users = await prisma.user.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      select: {
        id: true,
        familyId: true,
        email: true,
        mobile: true,
        firstName: true,
        lastName: true,
        fatherOrHusbandName: true,
        motherName: true,
        age: true,
        dateOfBirth: true,
        gender: true,
        bio: true,
        education: true,
        profession: true,
        gotra: true,
        motherGotra: true,
        state: true,
        district: true,
        currentAddress: true,
        ancestralVillage: true,
        profilePicture: true,
        height: true,
        complexion: true,
        maritalStatus: true,
        assignedVillage: true,
        manglik: true,
        birthTime: true,
        birthPlace: true,
        role: true,
        approvalStatus: true,
        createdAt: true,
        updatedAt: true,
        approvedAt: true,
        approvedBy: true,
        // Exclude sensitive fields
        password: false,
        otp: false,
        otpExpiry: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ users }, { status: 200 })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
