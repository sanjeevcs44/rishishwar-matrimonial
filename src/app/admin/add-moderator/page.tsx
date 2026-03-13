'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AddModeratorPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to add-user page
    // The add-user page will handle both USER and MODERATOR roles
    router.push('/admin/add-user')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl">Redirecting to Add User page...</p>
      </div>
    </div>
  )
}
