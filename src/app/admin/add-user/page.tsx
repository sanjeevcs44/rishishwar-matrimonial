'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MdArrowBack, MdAdminPanelSettings, MdPeople } from 'react-icons/md'
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

export default function AddUserPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    familyId: '',
    nameTitle: '',
    firstName: '',
    lastName: '',
    email: '',
    gotra: '',
    maritalStatus: '',
    age: '',
    ancestralVillage: '',
    fatherOrHusbandName: '',
    mobile: '',
    motherName: '',
    motherGotra: '',
    education: '',
    profession: '',
    yearlyIncome: '',
    state: '',
    district: '',
    village: '',
    currentAddress: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    bio: '',
    role: 'USER', // New field for role selection
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Console log village and gotra data
  console.log('Available Gotras:', GOTRA_OPTIONS)
  console.log('Available Ancestral Villages:', ANCESTRAL_VILLAGES)

  const handleStateChange = (newState: string) => {
    setFormData({ ...formData, state: newState, district: '', village: '' })
  }

  const handleDistrictChange = (newDistrict: string) => {
    setFormData({ ...formData, district: newDistrict, village: '' })
  }

  const handleGotraChange = (newGotra: string) => {
    console.log('Gotra selected:', newGotra)
    setFormData({ ...formData, gotra: newGotra })
  }

  const handleVillageChange = (newVillage: string) => {
    console.log('Ancestral Village selected:', newVillage)
    setFormData({ ...formData, ancestralVillage: newVillage })
  }

  const districtOptions = useMemo(() => {
    if (!formData.state) return []
    return DISTRICT_MAP[formData.state] || []
  }, [formData.state])

  const villageOptions = useMemo(() => {
    console.log('Computing villageOptions - District:', formData.district)
    if (!formData.district) {
      console.log('No district selected, returning empty array')
      return []
    }
    console.log(
      'District selected, returning all villages:',
      ANCESTRAL_VILLAGES.length,
      'villages',
    )
    return ANCESTRAL_VILLAGES
  }, [formData.district])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const generatedEmail =
        formData.email || `${formData.mobile}@matrimonial.com`

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: generatedEmail,
        password: formData.password,
        age: parseInt(formData.age),
        gender: formData.gender,
        mobile: formData.mobile,
        familyId: formData.familyId,
        fatherOrHusbandName: formData.fatherOrHusbandName,
        maritalStatus: formData.maritalStatus,
        education: formData.education,
        gotra: formData.gotra,
        profession: formData.profession,
        state: formData.state,
        district: formData.district,
        currentAddress: formData.currentAddress,
        ancestralVillage: formData.ancestralVillage,
        dateOfBirth: formData.dateOfBirth,
        bio: formData.bio,
        role: formData.role, // Include role in payload
      }

      console.log('Submitting user data:')
      console.log('Selected Gotra:', formData.gotra)
      console.log('Selected Ancestral Village:', formData.ancestralVillage)
      console.log('Full payload:', payload)

      const response = await fetch('/api/admin/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      setSuccess(
        `${formData.role === 'MODERATOR' ? 'Moderator' : 'User'} registered successfully!`,
      )
      setLoading(false)

      // Redirect to admin panel after 2 seconds
      setTimeout(() => {
        router.push('/admin')
      }, 2000)
    } catch (err) {
      console.error('Registration error:', err)
      setError('An error occurred during registration')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 to-purple-600 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <MdArrowBack className="text-white text-2xl" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Add New User
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg">
            <p className="font-semibold">Success!</p>
            <p>{success}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
              <label className="block text-lg font-bold text-gray-800 mb-4">
                Select Role *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'USER' })}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                    formData.role === 'USER'
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <MdPeople className="text-3xl text-blue-600" />
                  <div className="text-left">
                    <p className="font-bold text-gray-800">Regular User</p>
                    <p className="text-sm text-gray-600">
                      Can browse and manage own profile
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, role: 'MODERATOR' })
                  }
                  className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                    formData.role === 'MODERATOR'
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                >
                  <MdAdminPanelSettings className="text-3xl text-purple-600" />
                  <div className="text-left">
                    <p className="font-bold text-gray-800">Moderator</p>
                    <p className="text-sm text-gray-600">
                      Can approve/reject user profiles
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Basic Information
              </h3>

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
                    placeholder="First Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    उपनाम *
                  </label>
                  <select
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">चुनें</option>
                    {LAST_NAME_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    पिता/पति का नाम *
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    मोबाइल नंबर *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="10 digit mobile number"
                    pattern="[0-9]{10}"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ईमेल (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="email@example.com"
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
                    गोत्र *
                  </label>
                  <select
                    required
                    value={formData.gotra}
                    onChange={(e) => handleGotraChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">चुनें</option>
                    {GOTRA_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Education & Profession */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Education & Profession
              </h3>

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

            {/* Location Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Location Details
              </h3>

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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!formData.state}
                  >
                    <option value="">चुनें</option>
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
                    पैतृक गाँव *
                    {!formData.district && (
                      <span className="text-red-500 text-xs ml-2">
                        (पहले जिला चुनें)
                      </span>
                    )}
                  </label>
                  <select
                    required
                    value={formData.ancestralVillage}
                    onChange={(e) => handleVillageChange(e.target.value)}
                    disabled={!formData.district}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      !formData.district ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">
                      {!formData.district ? 'पहले जिला चुनें' : 'चुनें'}
                    </option>
                    {villageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {formData.district && villageOptions.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {villageOptions.length} गाँव उपलब्ध हैं
                    </p>
                  )}
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
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                Login Credentials
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
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

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Adding...'
                  : `Add ${formData.role === 'MODERATOR' ? 'Moderator' : 'User'}`}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
