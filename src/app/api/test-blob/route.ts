import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    
    return NextResponse.json({
      success: true,
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
