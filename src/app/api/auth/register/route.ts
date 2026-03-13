import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MaritalStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('========================================')
    console.log('Received registration request')
    console.log('Body keys:', Object.keys(body))
    console.log('Full body:', JSON.stringify(body, null, 2))
    console.log('========================================')

    const {
      firstName,
      lastName,
      fatherOrHusbandName,
      motherName,
      maritalStatus,
      dateOfBirth,
      education,
      gotra,
      motherGotra,
      profession,
      yearlyIncome,
      state,
      district,
      currentAddress,
      ancestralVillage,
      mobile,
      email,
      password,
      gender,
      manglik,
      birthTime,
      birthPlace,
    } = body

    // Compute age from dateOfBirth if age not supplied
    const computeAgeFromDOB = (dobStr: string) => {
      try {
        const dob = new Date(dobStr)
        const now = new Date()
        let ageCalc = now.getFullYear() - dob.getFullYear()
        const m = now.getMonth() - dob.getMonth()
        if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
          ageCalc--
        }
        return ageCalc
      } catch (err) {
        return null
      }
    }

    const computedAge = dateOfBirth ? computeAgeFromDOB(dateOfBirth) : null

    if (computedAge === null) {
      console.log('Invalid or unparsable dateOfBirth provided:', dateOfBirth)
      return NextResponse.json(
        { error: 'Invalid dateOfBirth. Please provide a valid date.' },
        { status: 400 },
      )
    }

    // Validation - require DOB (age will be derived) instead of manual age
    if (
      !firstName ||
      !lastName ||
      !mobile ||
      !password ||
      !dateOfBirth ||
      !gender
    ) {
      console.log('Validation failed: Missing basic fields', {
        firstName: !!firstName,
        lastName: !!lastName,
        mobile: !!mobile,
        password: !!password,
        dateOfBirth: !!dateOfBirth,
        gender: !!gender,
      })
      return NextResponse.json(
        {
          error:
            'Required fields: First Name, Last Name, Mobile, Password, Date of Birth, Gender',
        },
        { status: 400 },
      )
    }

    // Additional required fields based on schema
    if (
      !fatherOrHusbandName ||
      !state ||
      !district ||
      !currentAddress ||
      !ancestralVillage
    ) {
      console.log('Validation failed: Missing required fields', {
        fatherOrHusbandName: !!fatherOrHusbandName,
        state: !!state,
        district: !!district,
        currentAddress: !!currentAddress,
        ancestralVillage: !!ancestralVillage,
      })
      return NextResponse.json(
        {
          error:
            'Required fields: Father/Husband Name, State, District, Current Address, Ancestral Village',
        },
        { status: 400 },
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 },
      )
    }

    // Check if mobile already exists
    const existingUser = await prisma.user.findUnique({
      where: { mobile },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Mobile number already registered' },
        { status: 400 },
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Convert Hindi marital status to English enum
    const maritalStatusMap: Record<string, MaritalStatus> = {
      अविवाहित: MaritalStatus.UNMARRIED,
      विवाहित: MaritalStatus.MARRIED,
      तलाकशुदा: MaritalStatus.DIVORCED,
      विधवा: MaritalStatus.WIDOWED,
      विधुर: MaritalStatus.WIDOWED,
      'विधवा/विधुर': MaritalStatus.WIDOWED,
    }
    const normalizedMaritalStatus: MaritalStatus =
      maritalStatusMap[maritalStatus] || MaritalStatus.UNMARRIED

    console.log('Creating user in database with data:', {
      firstName,
      lastName,
      fatherOrHusbandName,
      motherName,
      // prefer computedAge (from DOB) over any supplied age
      age: computedAge,
      gender,
      mobile,
      state,
      district,
      currentAddress,
      ancestralVillage,
      gotra,
      motherGotra,
      education,
      profession,
      yearlyIncome,
      dateOfBirth,
      maritalStatus: normalizedMaritalStatus,
    })

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        fatherOrHusbandName,
        motherName: motherName?.trim() || null,
        maritalStatus: normalizedMaritalStatus,
        age: computedAge,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        education: education?.trim() || null,
        gotra: gotra?.trim() || null,
        motherGotra: motherGotra?.trim() || null,
        profession: profession?.trim() || null,
        yearlyIncome: yearlyIncome?.trim() || null,
        state,
        district,
        currentAddress,
        ancestralVillage,
        mobile,
        email: email?.trim() || null,
        password: hashedPassword,
        gender,
        role: 'USER',
        approvalStatus: 'PENDING',
        isFirstLogin: true,
        manglik: manglik?.trim() || null,
        birthTime: birthTime?.trim() || null,
        birthPlace: birthPlace?.trim() || null,
      },
    })

    // Return user without password and OTP
    const { password: _, otp: __, ...userWithoutSensitiveData } = user

    return NextResponse.json(
      {
        message: 'User registered successfully. Awaiting approval.',
        user: userWithoutSensitiveData,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('========================================')
    console.error('Registration error occurred')
    console.error('Error message:', error.message)
    console.error('Error name:', error.name)
    console.error('Error stack:', error.stack)
    console.error('Error object:', error)
    console.error('========================================')

    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field'
      const fieldName =
        field === 'email'
          ? 'Email'
          : field === 'mobile'
            ? 'Mobile number'
            : field
      return NextResponse.json(
        {
          error: `${fieldName} is already registered. Please use a different ${fieldName.toLowerCase()}.`,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
