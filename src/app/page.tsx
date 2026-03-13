'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn === 'true') {
      // Check user role and redirect accordingly
      const currentUserStr = localStorage.getItem('currentUser')
      if (currentUserStr) {
        const user = JSON.parse(currentUserStr)
        if (user.role === 'MODERATOR') {
          router.push('/moderator/dashboard')
        } else {
          router.push('/home')
        }
      } else {
        router.push('/home')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Matrimonial App</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
