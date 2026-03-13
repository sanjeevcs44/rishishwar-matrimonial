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

    // Update user approval status to rejected
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        approvalStatus: 'REJECTED',
        approvedBy: moderatorId,
        approvedAt: new Date(),
      },
    })

    return NextResponse.json({
      message: 'User rejected',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error rejecting user:', error)
    return NextResponse.json(
      { error: 'Failed to reject user' },
      { status: 500 },
    )
  }
}
