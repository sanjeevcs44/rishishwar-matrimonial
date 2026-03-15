'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  MdVerified,
  MdAdminPanelSettings,
  MdPending,
  MdCancel,
} from 'react-icons/md'
import { FaUserShield } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Helper function to format combined gotra/village (latin-hindi format)
const formatCombinedValue = (value: string | null): string => {
  if (!value) return ''

  // If it contains a hyphen, split and show only the Hindi part
  if (value.includes('-')) {
    const parts = value.split('-')
    return parts[1] || value // Return Hindi part or original if split fails
  }

  return value // Return as-is if no hyphen
}

// Helper function to check if two gotras match (considering combined format)
const gotrasMatch = (gotra1: string | null, gotra2: string | null): boolean => {
  if (!gotra1 || !gotra2) return false

  // Normalize gotras by removing the latin part if present
  const normalize = (gotra: string) => {
    if (gotra.includes('-')) {
      return gotra.split('-')[1] || gotra
    }
    return gotra
  }

  return normalize(gotra1) === normalize(gotra2)
}

// Helper function to filter and sort users based on gotra matching rules
const filterAndSortUsers = (
  users: User[],
  currentUser: User | null,
): { perfectMatches: User[]; partialMatches: User[] } => {
  if (!currentUser) return { perfectMatches: users, partialMatches: [] }

  // Filter by role and approval status first
  let filteredUsers = users.filter((user) => {
    // Only show APPROVED profiles
    if (user.approvalStatus !== 'APPROVED') {
      return false
    }

    if (currentUser.role === 'USER') {
      return user.role === 'USER'
    }
    return true
  })

  // For regular users, apply gotra-based filtering and sorting
  if (currentUser.role === 'USER') {
    // Filter: opposite gender only
    filteredUsers = filteredUsers.filter(
      (user) => user.gender !== currentUser.gender,
    )

    // Separate into two groups
    const perfectMatches: User[] = [] // No gotra or mother gotra match
    const partialMatches: User[] = [] // No gotra match but mother gotra can match

    filteredUsers.forEach((user) => {
      const gotraMatches = gotrasMatch(user.gotra, currentUser.gotra)
      const motherGotraMatchesUserGotra = gotrasMatch(
        user.motherGotra,
        currentUser.gotra,
      )
      const userMotherGotraMatchesGotra = gotrasMatch(
        currentUser.motherGotra,
        user.gotra,
      )
      const motherGotrasMatch = gotrasMatch(
        user.motherGotra,
        currentUser.motherGotra,
      )

      // Check if gotra matches either user's gotra or user's mother's gotra
      const hasGotraConflict =
        gotraMatches ||
        motherGotraMatchesUserGotra ||
        userMotherGotraMatchesGotra

      // Check if mother's gotras match
      const hasMotherGotraConflict = motherGotrasMatch

      if (!hasGotraConflict && !hasMotherGotraConflict) {
        // Perfect match: no gotra conflicts at all
        perfectMatches.push(user)
      } else if (!hasGotraConflict && hasMotherGotraConflict) {
        // Partial match: no gotra conflict but mother gotras match
        partialMatches.push(user)
      }
      // Users with gotra conflicts are excluded completely
    })

    // Return categorized matches
    return { perfectMatches, partialMatches }
  }

  return { perfectMatches: filteredUsers, partialMatches: [] }
}

interface User {
  id: string
  firstName: string
  lastName: string
  email: string | null
  mobile: string
  age: number
  gender: string
  bio: string | null
  education: string | null
  profession: string | null
  gotra: string | null
  motherGotra: string | null
  ancestralVillage: string | null
  fatherOrHusbandName: string | null
  state: string | null
  district: string | null
  currentAddress: string | null
  height: string | null
  maritalStatus: string | null
  profilePicture: string | null
  role: string
  approvalStatus: string
  assignedVillage?: string | null
  manglik?: string | null
  birthTime?: string | null
  birthPlace?: string | null
}

interface VillageModerator {
  firstName: string
  lastName: string
  mobile: string
  profilePicture?: string | null
}

export default function HomePage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [villageModerator, setVillageModerator] =
    useState<VillageModerator | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      if (isLoggedIn !== 'true') {
        router.push('/login')
        return
      }

      const currentUserStr = localStorage.getItem('currentUser')
      if (currentUserStr) {
        const user = JSON.parse(currentUserStr)

        // Redirect moderators to their dashboard
        if (user.role === 'MODERATOR') {
          router.push('/moderator/dashboard')
          return
        }

        setCurrentUser(user)

        // Fetch village moderator or admin if user is regular USER
        if (user.role === 'USER') {
          console.log('User village:', user.ancestralVillage)
          try {
            // Try to fetch moderator if village is provided
            if (user.ancestralVillage) {
              const modResponse = await fetch(
                `/api/moderator/by-village?village=${user.ancestralVillage}`,
              )
              console.log('Moderator response status:', modResponse.status)
              if (modResponse.ok) {
                const modData = await modResponse.json()
                console.log('Moderator found:', modData)
                // Check if moderator actually exists (not null)
                if (modData.moderator) {
                  setVillageModerator(modData.moderator)
                  setIsAdmin(false)
                } else {
                  // Moderator is null, fetch admin details
                  console.log('Moderator is null, fetching admin...')
                  const adminResponse = await fetch(`/api/users?role=ADMIN`)
                  if (adminResponse.ok) {
                    const adminData = await adminResponse.json()
                    console.log('Admin data:', adminData)
                    if (adminData.users && adminData.users.length > 0) {
                      const admin = adminData.users[0]
                      setVillageModerator({
                        firstName: admin.firstName,
                        lastName: admin.lastName,
                        mobile: admin.mobile,
                        profilePicture: admin.profilePicture,
                      })
                      setIsAdmin(true)
                      console.log('Admin set as contact')
                    }
                  }
                }
              } else {
                // If no moderator found, fetch admin details
                console.log('No moderator found, fetching admin...')
                const adminResponse = await fetch(`/api/users?role=ADMIN`)
                if (adminResponse.ok) {
                  const adminData = await adminResponse.json()
                  console.log('Admin data:', adminData)
                  if (adminData.users && adminData.users.length > 0) {
                    const admin = adminData.users[0]
                    setVillageModerator({
                      firstName: admin.firstName,
                      lastName: admin.lastName,
                      mobile: admin.mobile,
                      profilePicture: admin.profilePicture,
                    })
                    setIsAdmin(true)
                    console.log('Admin set as contact')
                  }
                }
              }
            } else {
              // No village provided, show admin directly
              console.log('No village provided, fetching admin...')
              const adminResponse = await fetch(`/api/users?role=ADMIN`)
              if (adminResponse.ok) {
                const adminData = await adminResponse.json()
                console.log('Admin data:', adminData)
                if (adminData.users && adminData.users.length > 0) {
                  const admin = adminData.users[0]
                  setVillageModerator({
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    mobile: admin.mobile,
                    profilePicture: admin.profilePicture,
                  })
                  setIsAdmin(true)
                  console.log('Admin set as contact (no village)')
                }
              }
            }
          } catch (error) {
            console.error('Error fetching moderator:', error)
            // If error, try to fetch admin as fallback
            try {
              console.log('Error occurred, fetching admin as fallback...')
              const adminResponse = await fetch(`/api/users?role=ADMIN`)
              if (adminResponse.ok) {
                const adminData = await adminResponse.json()
                console.log('Admin fallback data:', adminData)
                if (adminData.users && adminData.users.length > 0) {
                  const admin = adminData.users[0]
                  setVillageModerator({
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    mobile: admin.mobile,
                    profilePicture: admin.profilePicture,
                  })
                  setIsAdmin(true)
                  console.log('Admin set as contact (fallback)')
                }
              }
            } catch (adminError) {
              console.error('Error fetching admin:', adminError)
            }
          }
        }

        try {
          const response = await fetch(`/api/users?excludeId=${user.id}`)
          const data = await response.json()

          if (response.ok) {
            setUsers(data.users)
          } else {
            console.error('Failed to fetch users:', data.error)
          }
        } catch (error) {
          console.error('Error fetching users:', error)
        }
      }

      setLoading(false)
    }

    fetchUsers()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-pink-600 to-purple-600 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Rishishwar Matrimonial Logo"
                className="h-12 w-auto"
              />
              <h1 className="text-xl md:text-2xl font-bold text-white">
                ऋषीश्वर मैट्रिमोनियल (Rishishwar Matrimonial)
              </h1>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className="text-white text-sm md:text-base text-center">
                  Welcome,{' '}
                  <strong>
                    {currentUser?.firstName} {currentUser?.lastName}
                  </strong>
                </span>
                {currentUser?.role === 'ADMIN' && (
                  <Badge variant="warning">
                    <MdAdminPanelSettings className="text-sm" />
                    Admin
                  </Badge>
                )}
                {currentUser?.role === 'MODERATOR' && (
                  <Badge variant="info">
                    <FaUserShield className="text-xs" />
                    Moderator
                  </Badge>
                )}
              </div>
              <div className="flex gap-2 md:gap-3">
                <Button
                  onClick={() => router.push('/profile')}
                  variant="default"
                  size="default"
                  className="bg-info hover:bg-info/90"
                >
                  My Profile
                </Button>
                {currentUser?.role === 'MODERATOR' && (
                  <Button
                    onClick={() => router.push('/moderator/dashboard')}
                    variant="secondary"
                  >
                    <MdAdminPanelSettings />
                    <span className="hidden sm:inline">Moderator</span>
                  </Button>
                )}
                {currentUser?.role === 'ADMIN' && (
                  <Button
                    onClick={() => router.push('/admin')}
                    variant="secondary"
                  >
                    <MdAdminPanelSettings />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                )}
                <Button onClick={handleLogout} variant="destructive">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Find Your Perfect Match
        </h2>

        {/* Village Moderator Contact Card */}
        {villageModerator && currentUser?.role === 'USER' && (
          <div className="mb-6">
            <Card
              className={`${isAdmin ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300'}`}
            >
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`${isAdmin ? 'bg-yellow-500' : 'bg-blue-500'} text-white rounded-full flex items-center justify-center overflow-hidden flex-shrink-0`}
                    style={{ width: '64px', height: '64px' }}
                  >
                    {villageModerator.profilePicture ? (
                      <img
                        src={villageModerator.profilePicture}
                        alt={`${villageModerator.firstName} ${villageModerator.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        {isAdmin ? (
                          <MdAdminPanelSettings className="text-3xl" />
                        ) : (
                          <FaUserShield className="text-3xl" />
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">
                      आपका संपर्क सूत्र (Your Point of Contact)
                    </h3>
                    <p className="text-gray-700">
                      <strong>{isAdmin ? 'एडमिन' : 'मॉडरेटर'}:</strong>{' '}
                      {villageModerator.firstName} {villageModerator.lastName}
                    </p>
                    <p className="text-gray-700">
                      <strong>मोबाइल:</strong>{' '}
                      <a
                        href={`tel:${villageModerator.mobile}`}
                        className={`${isAdmin ? 'text-yellow-600' : 'text-blue-600'} hover:underline`}
                      >
                        {villageModerator.mobile}
                      </a>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {isAdmin
                        ? 'आपके गांव के लिए कोई मॉडरेटर उपलब्ध नहीं है। कृपया एडमिन से संपर्क करें। (No moderator available for your village. Please contact Admin.)'
                        : 'किसी भी जानकारी के लिए संपर्क करें (Contact for any information)'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentUser?.approvalStatus === 'PENDING' &&
          currentUser?.role === 'USER' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-6 rounded-lg mb-6 shadow-md">
              <div className="flex items-start">
                <MdPending className="text-3xl mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Your Profile is Pending Approval
                  </h3>
                  <p className="text-sm">
                    Your registration is currently under review by our
                    moderators. You will be able to view other profiles once
                    your account is approved. This usually takes 24-48 hours.
                    Thank you for your patience!
                  </p>
                </div>
              </div>
            </div>
          )}

        {currentUser?.approvalStatus === 'APPROVED' ||
        currentUser?.role === 'ADMIN' ||
        currentUser?.role === 'MODERATOR'
          ? (() => {
              const { perfectMatches, partialMatches } = filterAndSortUsers(
                users,
                currentUser,
              )
              const totalMatches = perfectMatches.length + partialMatches.length

              return totalMatches === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-muted">
                    No compatible matches found. Be the first to invite someone!
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Perfect Matches Section */}
                  {perfectMatches.length > 0 && (
                    <div>
                      {/* Only show header for regular users, not admin/moderator */}
                      {currentUser?.role === 'USER' && (
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            सर्वोत्तम मिलान (Perfect Matches)
                          </h2>
                          <p className="text-gray-600">
                            गोत्र और माता के गोत्र में कोई मेल नहीं (
                            {perfectMatches.length} प्रोफाइल)
                          </p>
                        </div>
                      )}
                      {currentUser?.role !== 'USER' && (
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            All Users ({perfectMatches.length} प्रोफाइल)
                          </h2>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {perfectMatches.map((user) => (
                          <Card
                            key={user.id}
                            className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-md"
                          >
                            {/* Profile Image - Full width at top */}
                            <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden">
                              {user.profilePicture ? (
                                <img
                                  src={user.profilePicture}
                                  alt={`${user.firstName} ${user.lastName}`}
                                  className="w-full h-full object-cover object-[center_20%]"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-white text-6xl font-bold">
                                    {user.firstName.charAt(0)}
                                    {user.lastName.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>

                            <CardContent className="p-4">
                              {/* Name and Badges */}
                              <div className="mb-3">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                  {user.firstName} {user.lastName}
                                </h3>
                                <div className="flex flex-wrap gap-1">
                                  {user.role === 'ADMIN' && (
                                    <Badge
                                      variant="warning"
                                      className="text-xs"
                                    >
                                      <MdAdminPanelSettings className="mr-1" />
                                      Admin
                                    </Badge>
                                  )}
                                  {user.role === 'MODERATOR' && (
                                    <Badge variant="info" className="text-xs">
                                      <FaUserShield className="mr-1" />
                                      Moderator
                                    </Badge>
                                  )}
                                  {user.approvalStatus === 'APPROVED' && (
                                    <Badge
                                      variant="success"
                                      className="text-xs"
                                    >
                                      <MdVerified className="mr-1" />
                                      Approved
                                    </Badge>
                                  )}
                                  {user.approvalStatus === 'PENDING' && (
                                    <Badge
                                      variant="warning"
                                      className="text-xs"
                                    >
                                      <MdPending className="mr-1" />
                                      Pending
                                    </Badge>
                                  )}
                                  {user.approvalStatus === 'REJECTED' && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      <MdCancel className="mr-1" />
                                      Rejected
                                    </Badge>
                                  )}
                                  {user.manglik === 'YES' && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      मांगलिक
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Profile Details */}
                              <div className="space-y-2 text-sm text-gray-600 mb-4">
                                {user.fatherOrHusbandName && (
                                  <p>
                                    <strong>पिता/पति:</strong>{' '}
                                    {user.fatherOrHusbandName}
                                  </p>
                                )}
                                <p>
                                  <strong>आयु/लिंग:</strong> {user.age} years •{' '}
                                  {user.gender}
                                </p>
                                {user.gotra && (
                                  <p>
                                    <strong>गोत्र:</strong>{' '}
                                    {formatCombinedValue(user.gotra)}
                                  </p>
                                )}
                                {user.motherGotra && (
                                  <p>
                                    <strong>माता का गोत्र:</strong>{' '}
                                    {formatCombinedValue(user.motherGotra)}
                                  </p>
                                )}
                                {user.ancestralVillage && (
                                  <p>
                                    <strong>गांव:</strong>{' '}
                                    {formatCombinedValue(user.ancestralVillage)}
                                  </p>
                                )}
                                {user.education && (
                                  <p>
                                    <strong>शिक्षा:</strong> {user.education}
                                  </p>
                                )}
                              </div>

                              {/* Footer with timestamp and button */}
                              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                  Profile ID: {user.id.substring(0, 8)}
                                </p>
                                <Button
                                  onClick={() =>
                                    router.push(`/admin/profile/${user.id}`)
                                  }
                                  variant="default"
                                  size="sm"
                                >
                                  View Profile
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Partial Matches Section */}
                  {partialMatches.length > 0 &&
                    currentUser?.role === 'USER' && (
                      <div>
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            आंशिक मिलान (Partial Matches)
                          </h2>
                          <p className="text-gray-600">
                            गोत्र अलग है लेकिन माता का गोत्र समान है (
                            {partialMatches.length} प्रोफाइल)
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {partialMatches.map((user) => (
                            <Card
                              key={user.id}
                              className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-md"
                            >
                              {/* Profile Image - Full width at top */}
                              <div className="relative h-48 bg-gradient-to-br from-orange-400 to-amber-400 overflow-hidden">
                                {user.profilePicture ? (
                                  <img
                                    src={user.profilePicture}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="w-full h-full object-cover object-[center_20%]"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-white text-6xl font-bold">
                                      {user.firstName.charAt(0)}
                                      {user.lastName.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <CardContent className="p-4">
                                {/* Name and Badges */}
                                <div className="mb-3">
                                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {user.firstName} {user.lastName}
                                  </h3>
                                  <div className="flex flex-wrap gap-1">
                                    {user.role === 'ADMIN' && (
                                      <Badge
                                        variant="warning"
                                        className="text-xs"
                                      >
                                        <MdAdminPanelSettings className="mr-1" />
                                        Admin
                                      </Badge>
                                    )}
                                    {user.role === 'MODERATOR' && (
                                      <Badge variant="info" className="text-xs">
                                        <FaUserShield className="mr-1" />
                                        Moderator
                                      </Badge>
                                    )}
                                    {user.approvalStatus === 'APPROVED' && (
                                      <Badge
                                        variant="success"
                                        className="text-xs"
                                      >
                                        <MdVerified className="mr-1" />
                                        Approved
                                      </Badge>
                                    )}
                                    {user.approvalStatus === 'PENDING' && (
                                      <Badge
                                        variant="warning"
                                        className="text-xs"
                                      >
                                        <MdPending className="mr-1" />
                                        Pending
                                      </Badge>
                                    )}
                                    {user.approvalStatus === 'REJECTED' && (
                                      <Badge
                                        variant="destructive"
                                        className="text-xs"
                                      >
                                        <MdCancel className="mr-1" />
                                        Rejected
                                      </Badge>
                                    )}
                                    {user.manglik === 'YES' && (
                                      <Badge
                                        variant="destructive"
                                        className="text-xs"
                                      >
                                        मांगलिक
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {/* Profile Details */}
                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                  {user.fatherOrHusbandName && (
                                    <p>
                                      <strong>पिता/पति:</strong>{' '}
                                      {user.fatherOrHusbandName}
                                    </p>
                                  )}
                                  <p>
                                    <strong>आयु/लिंग:</strong> {user.age} years
                                    • {user.gender}
                                  </p>
                                  {user.gotra && (
                                    <p>
                                      <strong>गोत्र:</strong>{' '}
                                      {formatCombinedValue(user.gotra)}
                                    </p>
                                  )}
                                  {user.motherGotra && (
                                    <p>
                                      <strong>माता का गोत्र:</strong>{' '}
                                      {formatCombinedValue(user.motherGotra)}
                                    </p>
                                  )}
                                  {user.ancestralVillage && (
                                    <p>
                                      <strong>गांव:</strong>{' '}
                                      {formatCombinedValue(
                                        user.ancestralVillage,
                                      )}
                                    </p>
                                  )}
                                  {user.education && (
                                    <p>
                                      <strong>शिक्षा:</strong> {user.education}
                                    </p>
                                  )}
                                </div>

                                {/* Footer with timestamp and button */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                  <p className="text-xs text-gray-500">
                                    Profile ID: {user.id.substring(0, 8)}
                                  </p>
                                  <Button
                                    onClick={() =>
                                      router.push(`/admin/profile/${user.id}`)
                                    }
                                    variant="default"
                                    size="sm"
                                  >
                                    View Profile
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )
            })()
          : null}
      </main>

      <footer className="bg-white mt-12 py-6 border-t border-gray-200">
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
