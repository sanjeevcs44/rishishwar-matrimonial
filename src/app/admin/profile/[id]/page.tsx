'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  MdArrowBack,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdCake,
  MdSchool,
  MdWork,
  MdPerson,
  MdVerified,
  MdPending,
  MdCancel,
  MdAdminPanelSettings,
  MdCheckCircle,
  MdClose,
  MdEdit,
  MdSave,
} from 'react-icons/md'
import { FaUserShield } from 'react-icons/fa'
import { NAKSHATRAS, RASHIS, GANAS, NADIS } from '@/data/formOptions'

interface User {
  id: string
  familyId: string | null
  firstName: string
  lastName: string
  fatherOrHusbandName: string | null
  motherName: string | null
  email: string | null
  mobile: string
  age: number
  dateOfBirth: string | null
  gender: string
  maritalStatus: string | null
  bio: string | null
  education: string | null
  profession: string | null
  gotra: string | null
  motherGotra: string | null
  state: string | null
  district: string | null
  currentAddress: string | null
  ancestralVillage: string | null
  height: string | null
  complexion: string | null
  assignedVillage: string | null
  profilePicture: string | null
  role: string
  approvalStatus: string
  createdAt: string
  updatedAt: string
  approvedAt: string | null
  approvedBy: string | null
  manglik?: string | null
  birthTime?: string | null
  birthPlace?: string | null
  nakshatra?: string | null
  rashi?: string | null
  gana?: string | null
  nadi?: string | null
}

export default function UserProfilePage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<User | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<string>('USER')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      const currentUserStr = localStorage.getItem('currentUser')

      if (isLoggedIn !== 'true' || !currentUserStr) {
        router.push('/login')
        return
      }

      const currentUser = JSON.parse(currentUserStr)
      setCurrentUserRole(currentUser.role)

      if (currentUser.role !== 'ADMIN' && currentUser.role !== 'MODERATOR') {
        router.push('/home')
        return
      }

      try {
        const response = await fetch(`/api/users?id=${userId}`)
        const data = await response.json()

        if (response.ok) {
          const foundUser = data.users.find((u: User) => u.id === userId)
          if (foundUser) {
            setUser(foundUser)
            setEditedUser(foundUser)
            if (foundUser.profilePicture) {
              setImagePreview(foundUser.profilePicture)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }

      setLoading(false)
    }

    fetchUserProfile()
  }, [userId, router])

  const handleApprovalUpdate = async (newStatus: string) => {
    setUpdating(true)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalStatus: newStatus }),
      })

      const data = await response.json()

      if (response.ok) {
        if (user) {
          setUser({ ...user, approvalStatus: newStatus })
        }
        alert(`User ${newStatus.toLowerCase()} successfully!`)
      } else {
        alert(data.error || 'Failed to update approval status')
      }
    } catch (error) {
      console.error('Error updating approval status:', error)
      alert('An error occurred while updating approval status')
    } finally {
      setUpdating(false)
    }
  }

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
        alert('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
        return
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        alert('File size exceeds 5MB limit')
        return
      }

      setProfileImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    if (!editedUser) return

    setUpdating(true)
    try {
      // If new profile image is selected, upload it first
      let profilePicturePath = editedUser.profilePicture
      if (profileImage) {
        try {
          const imageFormData = new FormData()
          imageFormData.append('file', profileImage)
          imageFormData.append('userId', userId)

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
          alert('Failed to upload profile picture')
          setUpdating(false)
          return
        }
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editedUser,
          profilePicture: profilePicturePath,
        }),
      })

      const data = await response.json()

      console.log('Update response:', { status: response.status, data })

      if (response.ok) {
        const updatedUserData = {
          ...editedUser,
          profilePicture: profilePicturePath,
        }
        setUser(updatedUserData)
        setEditedUser(updatedUserData)
        setProfileImage(null)
        setIsEditing(false)
        alert('Profile updated successfully!')
      } else {
        console.error('Update failed:', data)
        alert(
          `Failed to update profile: ${data.details || data.error || 'Unknown error'}`,
        )
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('An error occurred while updating profile')
    } finally {
      setUpdating(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedUser(user)
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof User, value: any) => {
    if (editedUser) {
      setEditedUser({ ...editedUser, [field]: value })
    }
  }

  const renderEditableField = (
    label: string,
    field: keyof User,
    type: string = 'text',
    isTextarea: boolean = false,
  ) => {
    const displayValue = isEditing ? editedUser : user
    if (!displayValue) return null

    return (
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-600 mb-1">
          {label}
        </label>
        {isEditing ? (
          isTextarea ? (
            <textarea
              value={(displayValue[field] as string) || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          ) : (
            <input
              type={type}
              value={(displayValue[field] as string) || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          )
        ) : (
          <p className="text-gray-800 font-medium">
            {displayValue[field] ? String(displayValue[field]) : 'N/A'}
          </p>
        )}
      </div>
    )
  }

  const renderSelectField = (
    label: string,
    field: keyof User,
    options: string[],
  ) => {
    const displayValue = isEditing ? editedUser : user
    if (!displayValue) return null

    return (
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-600 mb-1">
          {label}
        </label>
        {isEditing ? (
          <select
            value={(displayValue[field] as string) || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-800 font-medium">
            {displayValue[field] ? String(displayValue[field]) : 'N/A'}
          </p>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading profile...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-600 mb-4">User not found</p>
          <button
            onClick={() => router.push('/admin')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const canEdit = currentUserRole === 'ADMIN' || currentUserRole === 'MODERATOR'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold"
            >
              <MdArrowBack className="text-xl" />
              Back to Dashboard
            </button>
            <img
              src="/logo.png"
              alt="Rishishwar Matrimonial Logo"
              className="h-9 w-auto ml-2"
            />
          </div>
          {canEdit && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={updating}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center gap-2 disabled:bg-gray-400"
                  >
                    <MdSave />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200 flex items-center gap-2"
                >
                  <MdEdit />
                  Edit Profile
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header Card */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-32"></div>
            <div className="relative px-8 pb-8">
              <div className="absolute -top-16 left-8">
                <div className="relative w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-5xl font-bold">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </span>
                  )}
                  {isEditing && (
                    <>
                      <label
                        htmlFor="adminProfileImage"
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                        title="Upload profile picture"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </label>
                      <input
                        type="file"
                        id="adminProfileImage"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="pt-20">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h1 className="text-3xl font-bold text-gray-800">
                        {user.firstName} {user.lastName}
                      </h1>
                      {user.role === 'ADMIN' && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          <MdAdminPanelSettings />
                          Admin
                        </span>
                      )}
                      {user.role === 'MODERATOR' && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          <FaUserShield />
                          Moderator
                        </span>
                      )}
                    </div>
                    {user.familyId && (
                      <p className="text-gray-600 mb-1">
                        <span className="font-semibold">Family ID:</span>{' '}
                        {user.familyId}
                      </p>
                    )}
                    <p className="text-gray-600 mb-3">
                      {user.age} years • {user.gender} •{' '}
                      {user.maritalStatus || 'Not specified'}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {user.approvalStatus === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded-full text-sm font-semibold">
                          <MdVerified />
                          Approved
                        </span>
                      )}
                      {user.approvalStatus === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 border border-yellow-300 px-4 py-2 rounded-full text-sm font-semibold">
                          <MdPending />
                          Pending Approval
                        </span>
                      )}
                      {user.approvalStatus === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 border border-red-300 px-4 py-2 rounded-full text-sm font-semibold">
                          <MdCancel />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Approval Action Buttons */}
                  {!isEditing && (
                    <div className="flex flex-col gap-2">
                      {user.approvalStatus !== 'APPROVED' && (
                        <button
                          onClick={() => handleApprovalUpdate('APPROVED')}
                          disabled={updating}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center gap-2 disabled:bg-gray-400"
                        >
                          <MdCheckCircle />
                          Approve
                        </button>
                      )}
                      {user.approvalStatus !== 'REJECTED' && (
                        <button
                          onClick={() => handleApprovalUpdate('REJECTED')}
                          disabled={updating}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200 flex items-center gap-2 disabled:bg-gray-400"
                        >
                          <MdClose />
                          Reject
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details Grid - All Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <MdPerson className="text-purple-600" />
                Basic Information
              </h2>
              {renderEditableField('First Name', 'firstName')}
              {renderEditableField('Last Name', 'lastName')}
              {renderEditableField(
                'Father/Husband Name',
                'fatherOrHusbandName',
              )}
              {renderEditableField('Mother Name', 'motherName')}
              {renderEditableField('Age', 'age', 'number')}
              {renderEditableField('Date of Birth', 'dateOfBirth', 'date')}
              {renderSelectField('Gender', 'gender', ['Male', 'Female'])}
              {renderSelectField('Marital Status', 'maritalStatus', [
                'UNMARRIED',
                'MARRIED',
                'DIVORCED',
                'WIDOWED',
              ])}
              {renderEditableField('Family ID', 'familyId')}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <MdPhone className="text-purple-600" />
                Contact Information
              </h2>
              {renderEditableField('Mobile', 'mobile', 'tel')}
              {renderEditableField('Email', 'email', 'email')}
            </div>

            {/* Education & Professional */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <MdSchool className="text-purple-600" />
                Education & Professional
              </h2>
              {renderEditableField('Education', 'education')}
              {renderEditableField('Profession', 'profession')}
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <MdPerson className="text-purple-600" />
                Personal Details
              </h2>
              {renderEditableField('Gotra', 'gotra')}
              {renderEditableField('Mother Gotra', 'motherGotra')}
              {renderEditableField('Height', 'height')}
              {renderEditableField('Complexion', 'complexion')}
            </div>

            {/* Location Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <MdLocationOn className="text-purple-600" />
                Location Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {renderEditableField('State', 'state')}
                  {renderEditableField('District', 'district')}
                </div>
                <div>
                  {renderEditableField('Ancestral Village', 'ancestralVillage')}
                  {user.role === 'MODERATOR' &&
                    renderEditableField('Assigned Village', 'assignedVillage')}
                </div>
              </div>
              {renderEditableField(
                'Current Address',
                'currentAddress',
                'text',
                true,
              )}
            </div>

            {/* Bio */}
            <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                About / Bio
              </h2>
              {renderEditableField('Bio', 'bio', 'text', true)}
            </div>

            {/* Astrological Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Astrological Details / ज्योतिषीय विवरण
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSelectField('Manglik / मांगलिक', 'manglik', [
                  '',
                  'YES',
                  'NO',
                ])}
                {renderEditableField(
                  'Birth Time / जन्म समय',
                  'birthTime',
                  'time',
                )}
                {renderEditableField('Birth Place / जन्म स्थान', 'birthPlace')}
                {renderSelectField('Nakshatra / नक्षत्र', 'nakshatra', [
                  '',
                  ...NAKSHATRAS,
                ])}
                {renderSelectField('Rashi / राशि', 'rashi', ['', ...RASHIS])}
                {renderSelectField('Gana / गण', 'gana', ['', ...GANAS])}
                {renderSelectField('Nadi / नाड़ी', 'nadi', ['', ...NADIS])}
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  {isEditing && currentUserRole === 'ADMIN' ? (
                    <select
                      value={editedUser?.role || user.role}
                      onChange={(e) =>
                        handleInputChange('role', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="USER">USER</option>
                      <option value="MODERATOR">MODERATOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  ) : (
                    <p className="font-semibold text-gray-800">{user.role}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Approval Status</p>
                  <p className="font-semibold text-gray-800">
                    {user.approvalStatus}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Registered On</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {user.updatedAt && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {user.approvedAt && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Approved At</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(user.approvedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {user.approvedBy && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Approved By</p>
                    <p className="font-semibold text-gray-800">
                      {user.approvedBy}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
