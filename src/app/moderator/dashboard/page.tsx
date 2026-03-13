'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  mobile: string
  gender: string
  age: number
  ancestralVillage: string | null
  gotra: string | null
  motherGotra: string | null
  education: string | null
  profession: string | null
  profilePicture: string | null
  approvalStatus: string
  createdAt: string
}

interface CurrentUser {
  id: string
  firstName: string
  lastName: string
  role: string
  assignedVillage: string | null
  mobile: string
}

export default function ModeratorDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const formatCombinedValue = (value: string | null): string => {
    if (!value) return ''
    if (value.includes('-')) {
      const parts = value.split('-')
      return parts[1] || value
    }
    return value
  }

  useEffect(() => {
    const currentUserStr = localStorage.getItem('currentUser')
    if (!currentUserStr) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(currentUserStr)

    // Check if user is moderator
    if (parsedUser.role !== 'MODERATOR') {
      router.push('/home')
      return
    }

    setCurrentUser(parsedUser)
    fetchPendingUsers(parsedUser.assignedVillage)
  }, [router])

  const fetchPendingUsers = async (assignedVillage: string | null) => {
    try {
      const response = await fetch(
        `/api/moderator/pending-users?village=${assignedVillage || ''}`,
      )
      if (response.ok) {
        const data = await response.json()
        setPendingUsers(data)
      }
    } catch (error) {
      console.error('Error fetching pending users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: string) => {
    try {
      const response = await fetch('/api/moderator/approve-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, moderatorId: currentUser?.id }),
      })

      if (response.ok) {
        alert('User approved successfully!')
        fetchPendingUsers(currentUser?.assignedVillage || null)
      } else {
        alert('Failed to approve user')
      }
    } catch (error) {
      console.error('Error approving user:', error)
      alert('Error approving user')
    }
  }

  const handleReject = async (userId: string) => {
    try {
      const response = await fetch('/api/moderator/reject-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, moderatorId: currentUser?.id }),
      })

      if (response.ok) {
        alert('User rejected')
        fetchPendingUsers(currentUser?.assignedVillage || null)
      } else {
        alert('Failed to reject user')
      }
    } catch (error) {
      console.error('Error rejecting user:', error)
      alert('Error rejecting user')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Rishishwar Matrimonial Logo"
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold text-primary">
                ऋषीश्वर मैट्रिमोनियल
              </h1>
              <p className="text-sm text-gray-600">
                मॉडरेटर डैशबोर्ड (Moderator Dashboard)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <p className="text-sm text-gray-600">
                गांव: {formatCombinedValue(currentUser?.assignedVillage || '')}
              </p>
            </div>
            <Button
              onClick={() => {
                localStorage.removeItem('isLoggedIn')
                localStorage.removeItem('currentUser')
                router.push('/login')
              }}
              variant="destructive"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            लंबित अनुमोदन (Pending Approvals)
          </h2>
          <p className="text-gray-600">
            आपके गांव {formatCombinedValue(currentUser?.assignedVillage || '')}{' '}
            से {pendingUsers.length} प्रोफाइल अनुमोदन के लिए प्रतीक्षारत हैं
          </p>
        </div>

        {pendingUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-xl text-gray-600">कोई लंबित अनुमोदन नहीं है</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span className="text-white text-xl font-bold">
                          {user.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {user.firstName} {user.lastName}
                      </CardTitle>
                      <Badge variant="warning" className="mt-1">
                        Pending
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p>
                      <strong>लिंग:</strong> {user.gender}
                    </p>
                    <p>
                      <strong>उम्र:</strong> {user.age}
                    </p>
                    <p>
                      <strong>मोबाइल:</strong> {user.mobile}
                    </p>
                    <p>
                      <strong>ईमेल:</strong> {user.email}
                    </p>
                  </div>

                  {user.gotra && (
                    <p className="text-sm">
                      <strong>गोत्र:</strong> {formatCombinedValue(user.gotra)}
                    </p>
                  )}

                  {user.motherGotra && (
                    <p className="text-sm">
                      <strong>माता का गोत्र:</strong>{' '}
                      {formatCombinedValue(user.motherGotra)}
                    </p>
                  )}

                  {user.ancestralVillage && (
                    <p className="text-sm">
                      <strong>पैतृक गाँव (Ancestral Village):</strong>{' '}
                      {formatCombinedValue(user.ancestralVillage)}
                    </p>
                  )}

                  {user.education && (
                    <p className="text-sm">
                      <strong>शिक्षा:</strong> {user.education}
                    </p>
                  )}

                  {user.profession && (
                    <p className="text-sm">
                      <strong>पेशा:</strong> {user.profession}
                    </p>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => router.push(`/admin/profile/${user.id}`)}
                      variant="outline"
                      className="flex-1"
                    >
                      View Profile
                    </Button>
                    <Button
                      onClick={() => handleApprove(user.id)}
                      variant="default"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(user.id)}
                      variant="destructive"
                      className="flex-1"
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white mt-8 py-6 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="text-lg font-semibold text-gray-800 mb-2">
            ऋषीश्वर मैट्रिमोनियल (Rishishwar Matrimonial)
          </p>
          <p className="text-sm">Maintained by Rishishwar Volunteers</p>
          <p className="text-xs mt-2">
            © 2026 Rishishwar Matrimonial. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
