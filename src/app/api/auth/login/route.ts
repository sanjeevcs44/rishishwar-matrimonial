import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mobile, password } = body

    // Validation
    if (!mobile || !password) {
      return NextResponse.json(
        { error: 'Mobile number and password are required' },
        { status: 400 },
      )
    }

    // Find user by mobile number
    const user = await prisma.user.findUnique({
      where: { mobile },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid mobile number or password' },
        { status: 401 },
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid mobile number or password' },
        { status: 401 },
      )
    }

    // Return user without password and OTP
    const { password: _, otp: __, ...userWithoutSensitiveData } = user

    console.log('=== LOGIN API - Returning user data ===')
    console.log(
      'User fields being returned:',
      Object.keys(userWithoutSensitiveData),
    )
    console.log('motherName:', userWithoutSensitiveData.motherName)
    console.log('motherGotra:', userWithoutSensitiveData.motherGotra)
    console.log('dateOfBirth:', userWithoutSensitiveData.dateOfBirth)
    console.log('=======================================')

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userWithoutSensitiveData,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
