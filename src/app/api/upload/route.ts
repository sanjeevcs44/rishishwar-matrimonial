import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const runtime = 'edge' // Use edge runtime for Vercel Blob

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    console.log('Upload request received for userId:', userId)

    if (!file) {
      console.error('No file provided')
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!userId) {
      console.error('No userId provided')
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 },
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      console.error('File too large:', file.size)
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 },
      )
    }

    // Check if BLOB_READ_WRITE_TOKEN is available
    const token = process.env.BLOB_READ_WRITE_TOKEN
    console.log('Token exists:', !!token)

    if (!token) {
      console.error('BLOB_READ_WRITE_TOKEN is not set')
      return NextResponse.json(
        {
          error: 'Blob storage not configured',
          details: 'BLOB_READ_WRITE_TOKEN environment variable is missing',
        },
        { status: 500 },
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `profiles/${userId}_${timestamp}.${extension}`

    console.log(
      'Attempting upload:',
      filename,
      'Size:',
      file.size,
      'Type:',
      file.type,
    )

    // Upload to Vercel Blob with explicit token
    const blob = await put(filename, file, {
      access: 'public',
      token: token,
    })

    console.log('Upload successful:', blob.url)

    // Return the public URL
    return NextResponse.json({
      message: 'File uploaded successfully',
      filePath: blob.url,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
