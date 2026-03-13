import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const village = searchParams.get('village')

    if (!village) {
      return NextResponse.json(
        { error: 'Village parameter is required' },
        { status: 400 },
      )
    }

    // Fetch pending users from the same village
    const pendingUsers = await prisma.user.findMany({
      where: {
        approvalStatus: 'PENDING',
        ancestralVillage: village,
        role: 'USER',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        gender: true,
        age: true,
        ancestralVillage: true,
        gotra: true,
        motherGotra: true,
        education: true,
        profession: true,
        approvalStatus: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(pendingUsers)
  } catch (error) {
    console.error('Error fetching pending users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending users' },
      { status: 500 },
    )
  }
}
