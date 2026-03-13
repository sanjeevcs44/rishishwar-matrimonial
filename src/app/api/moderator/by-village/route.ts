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

    // Find moderator assigned to this village
    const moderator = await prisma.user.findFirst({
      where: {
        role: 'MODERATOR',
        assignedVillage: village,
        approvalStatus: 'APPROVED',
      },
      select: {
        firstName: true,
        lastName: true,
        mobile: true,
      },
    })

    if (!moderator) {
      return NextResponse.json(
        { moderator: null, message: 'No moderator assigned to this village' },
        { status: 200 },
      )
    }

    return NextResponse.json({ moderator })
  } catch (error) {
    console.error('Error fetching village moderator:', error)
    return NextResponse.json(
      { error: 'Failed to fetch village moderator' },
      { status: 500 },
    )
  }
}
