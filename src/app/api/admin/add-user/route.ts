import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log('Admin add user request received:', body)

    const {
      firstName,
      lastName,
      email,
      password,
      age,
      gender,
      mobile,
      familyId,
      fatherOrHusbandName,
      maritalStatus,
      education,
      gotra,
      profession,
      state,
      district,
      currentAddress,
      ancestralVillage,
      dateOfBirth,
      bio,
      role, // USER or MODERATOR
    } = body

    // Validation
    if (
      !firstName ||
      !lastName ||
      !password ||
      !age ||
      !gender ||
      !mobile ||
      !fatherOrHusbandName ||
      !maritalStatus ||
      !education ||
      !gotra ||
      !profession ||
      !state ||
      !district ||
      !currentAddress ||
      !ancestralVillage
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Validate role
    if (role && !['USER', 'MODERATOR', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be USER, MODERATOR, or ADMIN' },
        { status: 400 },
      )
    }

    // Check if mobile already exists
    const existingUserByMobile = await prisma.user.findUnique({
      where: { mobile },
    })

    if (existingUserByMobile) {
      return NextResponse.json(
        { error: 'Mobile number already registered' },
        { status: 400 },
      )
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUserByEmail) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 },
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Convert Hindi marital status to English enum
    const maritalStatusMap: { [key: string]: string } = {
      अविवाहित: 'UNMARRIED',
      विवाहित: 'MARRIED',
      तलाकशुदा: 'DIVORCED',
      विधवा: 'WIDOWED',
      विधुर: 'WIDOWED',
      'विधवा/विधुर': 'WIDOWED',
    }
    const normalizedMaritalStatus =
      maritalStatusMap[maritalStatus] || maritalStatus || 'UNMARRIED'

    console.log('Creating user with role:', role || 'USER')

    // Create user with specified role
    // If role is MODERATOR or ADMIN, automatically approve them
    const userRole = role || 'USER'
    const approvalStatus =
      userRole === 'MODERATOR' || userRole === 'ADMIN' ? 'APPROVED' : 'PENDING'

    const user = await prisma.user.create({
      data: {
        familyId: familyId || null,
        firstName,
        lastName,
        fatherOrHusbandName,
        maritalStatus: normalizedMaritalStatus,
        age: parseInt(age),
        dateOfBirth: dateOfBirth || null,
        education,
        gotra,
        profession,
        state,
        district,
        currentAddress,
        ancestralVillage,
        mobile,
        email: email || null,
        password: hashedPassword,
        gender,
        bio: bio || null,
        role: userRole,
        approvalStatus: approvalStatus,
        isFirstLogin: true,
      },
    })

    console.log('User created successfully:', {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      approvalStatus: user.approvalStatus,
    })

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: `${userRole === 'MODERATOR' ? 'Moderator' : 'User'} registered successfully`,
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('Admin add user error:', error)

    // Handle Prisma unique constraint violations
    if (error.code === 'P2002') {
      const target = error.meta?.target
      if (target?.includes('mobile')) {
        return NextResponse.json(
          { error: 'Mobile number already registered' },
          { status: 400 },
        )
      }
      if (target?.includes('email')) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 },
        )
      }
      return NextResponse.json(
        { error: 'User with this information already exists' },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 },
    )
  }
}
