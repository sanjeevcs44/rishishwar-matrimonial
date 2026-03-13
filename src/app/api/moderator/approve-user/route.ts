import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { userId, moderatorId } = await request.json()

    if (!userId || !moderatorId) {
      return NextResponse.json(
        { error: 'User ID and Moderator ID are required' },
        { status: 400 },
      )
    }

    // Update user approval status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        approvalStatus: 'APPROVED',
        approvedBy: moderatorId,
        approvedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: 'User approved successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error approving user:', error)
    return NextResponse.json(
      { error: 'Failed to approve user' },
      { status: 500 },
    )
  }
}
