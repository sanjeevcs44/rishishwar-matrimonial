'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MdArrowBack, MdPending, MdCheckCircle, MdCancel } from 'react-icons/md'
import {
  NAME_TITLE_OPTIONS,
  LAST_NAME_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  EDUCATION_OPTIONS,
  GOTRA_OPTIONS,
  PROFESSION_OPTIONS,
  STATE_OPTIONS,
  DISTRICT_MAP,
  ANCESTRAL_VILLAGES,
} from '@/data/formOptions'

interface User {
  id: string
  familyId: string | null
  firstName: string
  lastName: string
  email: string | null
  mobile: string
  age: number
  gender: string
  bio: string | null
  education: string | null
  profession: string | null
  state: string
  district: string
  currentAddress: string
  ancestralVillage: string
  gotra: string | null
  motherName: string | null
  motherGotra: string | null
  maritalStatus: string
  fatherOrHusbandName: string
  dateOfBirth: string | null
  profilePicture: string | null
  role: string
  approvalStatus: string
  manglik: string | null
  birthTime: string | null
  birthPlace: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    familyId: '',
    nameTitle: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    age: '',
    gender: '',
    fatherOrHusbandName: '',
    motherName: '',
    maritalStatus: '',
    gotra: '',
    motherGotra: '',
    ancestralVillage: '',
    state: '',
    district: '',
    currentAddress: '',
    dateOfBirth: '',
    education: '',
    profession: '',
    bio: '',
    manglik: '',
    birthTime: '',
    birthPlace: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleStateChange = (newState: string) => {
    setFormData({ ...formData, state: newState, district: '' })
  }

  const handleDistrictChange = (newDistrict: string) => {
    setFormData({ ...formData, district: newDistrict })
  }

  const districtOptions = useMemo(() => {
    if (!formData.state) return []
    return DISTRICT_MAP[formData.state] || []
  }, [formData.state])

  const villageOptions = useMemo(() => {
    if (!formData.district) return []
    return ANCESTRAL_VILLAGES
  }, [formData.district])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ]
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
        return
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        setError('File size exceeds 5MB limit')
        return
      }

      setProfileImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn !== 'true') {
      router.push('/login')
      return
    }

    const currentUserStr = localStorage.getItem('currentUser')
    if (currentUserStr) {
      const userData = JSON.parse(currentUserStr)
      console.log('=== PROFILE PAGE - User Data from localStorage ===')
      console.log('Full userData:', userData)
      console.log('firstName:', userData.firstName)
      console.log('lastName:', userData.lastName)
      console.log('fatherOrHusbandName:', userData.fatherOrHusbandName)
      console.log('motherName:', userData.motherName)
      console.log('gotra:', userData.gotra)
      console.log('motherGotra:', userData.motherGotra)
      console.log('dateOfBirth:', userData.dateOfBirth)
      console.log('education:', userData.education)
      console.log('profession:', userData.profession)
      console.log('ancestralVillage:', userData.ancestralVillage)
      console.log('maritalStatus:', userData.maritalStatus)
      console.log('state:', userData.state)
      console.log('district:', userData.district)
      console.log('currentAddress:', userData.currentAddress)
      console.log('bio:', userData.bio)
      console.log('===================================================')
      setUser(userData)

      // Calculate age from date of birth
      let calculatedAge = userData.age?.toString() || ''
      if (userData.dateOfBirth) {
        const dob = new Date(userData.dateOfBirth)
        const today = new Date()
        let age = today.getFullYear() - dob.getFullYear()
        const monthDiff = today.getMonth() - dob.getMonth()
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < dob.getDate())
        ) {
          age--
        }
        calculatedAge = age.toString()
      }

      // Format date of birth for input field (YYYY-MM-DD)
      let formattedDOB = ''
      if (userData.dateOfBirth) {
        const dob = new Date(userData.dateOfBirth)
        formattedDOB = dob.toISOString().split('T')[0]
      }

      setFormData({
        familyId: userData.familyId || '',
        nameTitle: '', // Not stored in DB, optional field
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        mobile: userData.mobile || '',
        age: calculatedAge,
        gender: userData.gender || '',
        fatherOrHusbandName: userData.fatherOrHusbandName || '',
        motherName: userData.motherName || '',
        maritalStatus: userData.maritalStatus || '',
        gotra: userData.gotra || '',
        motherGotra: userData.motherGotra || '',
        ancestralVillage: userData.ancestralVillage || '',
        state: userData.state || '',
        district: userData.district || '',
        currentAddress: userData.currentAddress || '',
        dateOfBirth: formattedDOB,
        education: userData.education || '',
        profession: userData.profession || '',
        bio: userData.bio || '',
        manglik: userData.manglik || '',
        birthTime: userData.birthTime || '',
        birthPlace: userData.birthPlace || '',
      })

      // Set existing profile picture preview
      if (userData.profilePicture) {
        setImagePreview(userData.profilePicture)
      }
    }
    setLoading(false)
  }, [router])

  const handleDOBChange = (dob: string) => {
    setFormData({ ...formData, dateOfBirth: dob })

    // Auto-calculate age from DOB
    if (dob) {
      const birthDate = new Date(dob)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--
      }
      setFormData((prev) => ({
        ...prev,
        age: age.toString(),
        dateOfBirth: dob,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)

    try {
      // If new profile image is selected, upload it first
      let profilePicturePath = user?.profilePicture || null
      if (profileImage && user?.id) {
        try {
          const imageFormData = new FormData()
          imageFormData.append('file', profileImage)
          imageFormData.append('userId', user.id)

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: imageFormData,
          })

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json()
            profilePicturePath = uploadData.filePath
          }
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError)
          setError('Failed to upload profile picture')
          setSaving(false)
          return
        }
      }

      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          ...formData,
          age: parseInt(formData.age),
          profilePicture: profilePicturePath,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update profile')
        setSaving(false)
        return
      }

      setMessage('Profile updated successfully!')

      // Update localStorage
      const updatedUser = {
        ...user,
        ...formData,
        age: parseInt(formData.age),
        profilePicture: profilePicturePath,
      }
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      setUser(updatedUser as User)

      // Clear the profile image state but keep the preview
      setProfileImage(null)

      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error('Update error:', err)
      setError('An error occurred while updating profile')
      setSaving(false)
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 to-purple-600 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/home')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <MdArrowBack className="text-white text-2xl" />
            </button>
            <img
              src="/logo.png"
              alt="Rishishwar Matrimonial Logo"
              className="h-10 w-auto"
            />
            <h1 className="text-xl md:text-2xl font-bold text-white">
              My Profile
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Approval Status Banner */}
        {user?.approvalStatus === 'PENDING' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-lg">
            <div className="flex items-center gap-2">
              <MdPending className="text-2xl" />
              <div>
                <h3 className="font-bold">Profile Pending Approval</h3>
                <p className="text-sm">
                  Your profile is under review by moderators.
                </p>
              </div>
            </div>
          </div>
        )}

        {user?.approvalStatus === 'APPROVED' && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 mb-6 rounded-lg">
            <div className="flex items-center gap-2">
              <MdCheckCircle className="text-2xl" />
              <div>
                <h3 className="font-bold">Profile Approved</h3>
                <p className="text-sm">
                  Your profile has been approved and is visible to others.
                </p>
              </div>
            </div>
          </div>
        )}

        {user?.approvalStatus === 'REJECTED' && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 mb-6 rounded-lg">
            <div className="flex items-center gap-2">
              <MdCancel className="text-2xl" />
              <div>
                <h3 className="font-bold">Profile Rejected</h3>
                <p className="text-sm">
                  Please contact support for more information.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg">
            <p className="font-semibold">Success!</p>
            <p>{message}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {/* Profile Picture Section at Top */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b">
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center border-4 border-purple-200">
                    <span className="text-white text-4xl font-bold">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </span>
                  </div>
                )}
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors"
                  title="Upload profile picture"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  प्रोफाइल फोटो अपलोड करें (Upload Profile Picture)
                </p>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-400 mt-1">
                  JPEG, PNG, WebP • Max 5MB
                </p>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-xl font-bold text-gray-800">
                  Basic Information
                </h3>
                <p className="text-sm text-gray-500">मूल जानकारी</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    पहचान पत्र नंबर
                  </label>
                  <input
                    type="text"
                    value={formData.familyId}
                    onChange={(e) =>
                      setFormData({ ...formData, familyId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    नाम उपसर्ग
                  </label>
                  <select
                    value={formData.nameTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, nameTitle: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">चुनें</option>
                    {NAME_TITLE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    नाम *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    पदवी (Last Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    पिता/पति का नाम (Father/Husband Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fatherOrHusbandName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fatherOrHusbandName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    माता का नाम (Mother&apos;s Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.motherName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        motherName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter mother's name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    लिंग *
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">चुनें</option>
                    <option value="Male">पुरुष</option>
                    <option value="Female">महिला</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    आयु *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="18"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    जन्म तिथि (Date of Birth) *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => handleDOBChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    मोबाइल नंबर * (Read Only)
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ईमेल (Read Only)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    वैवाहिक स्थिति *
                  </label>
                  <select
                    required
                    value={formData.maritalStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maritalStatus: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">चुनें</option>
                    {MARITAL_STATUS_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    गोत्र (Gotra) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.gotra}
                    onChange={(e) =>
                      setFormData({ ...formData, gotra: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter gotra (e.g., Gautam गौतम)"
                    list="gotra-list"
                  />
                  <datalist id="gotra-list">
                    {GOTRA_OPTIONS.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    माता का गोत्र (Mother&apos;s Gotra) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.motherGotra}
                    onChange={(e) =>
                      setFormData({ ...formData, motherGotra: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter mother's gotra"
                    list="mother-gotra-list"
                  />
                  <datalist id="mother-gotra-list">
                    {GOTRA_OPTIONS.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Astrological Details */}
              <div className="border-b pb-2 mt-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Astrological Details
                </h3>
                <p className="text-sm text-gray-500">ज्योतिषीय विवरण</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    मांगलिक (Manglik)
                  </label>
                  <select
                    value={formData.manglik}
                    onChange={(e) =>
                      setFormData({ ...formData, manglik: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">चुनें</option>
                    <option value="YES">हाँ (Yes)</option>
                    <option value="NO">नहीं (No)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    जन्म समय (Birth Time)
                  </label>
                  <input
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) =>
                      setFormData({ ...formData, birthTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    जन्म स्थान (Birth Place)
                  </label>
                  <input
                    type="text"
                    value={formData.birthPlace}
                    onChange={(e) =>
                      setFormData({ ...formData, birthPlace: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter birth place"
                  />
                </div>
              </div>
            </div>

            {/* Education & Professional Section */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-xl font-bold text-gray-800">
                  Educational & Professional Details
                </h3>
                <p className="text-sm text-gray-500">
                  शैक्षिक और व्यावसायिक विवरण
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    शिक्षा *
                  </label>
                  <select
                    required
                    value={formData.education}
                    onChange={(e) =>
                      setFormData({ ...formData, education: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">चुनें</option>
                    {EDUCATION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    व्यवसाय *
                  </label>
                  <select
                    required
                    value={formData.profession}
                    onChange={(e) =>
                      setFormData({ ...formData, profession: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">चुनें</option>
                    {PROFESSION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location Details Section */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-xl font-bold text-gray-800">
                  Location Details
                </h3>
                <p className="text-sm text-gray-500">स्थान विवरण</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    राज्य *
                  </label>
                  <select
                    required
                    value={formData.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">चुनें</option>
                    {STATE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    जिला *
                  </label>
                  <select
                    required
                    value={formData.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    disabled={!formData.state}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      !formData.state ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">
                      {!formData.state ? 'पहले राज्य चुनें' : 'चुनें'}
                    </option>
                    {districtOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    पैतृक गाँव (Ancestral Village) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ancestralVillage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ancestralVillage: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter ancestral village"
                    list="village-list"
                  />
                  <datalist id="village-list">
                    {ANCESTRAL_VILLAGES.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    वर्तमान पता *
                  </label>
                  <textarea
                    required
                    value={formData.currentAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentAddress: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-xl font-bold text-gray-800">About Me</h3>
                <p className="text-sm text-gray-500">मेरे बारे में</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/home')}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
