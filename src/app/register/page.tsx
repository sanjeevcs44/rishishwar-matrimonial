'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MARITAL_STATUS_OPTIONS,
  EDUCATION_OPTIONS,
  GOTRA_OPTIONS,
  PROFESSION_OPTIONS,
  STATE_OPTIONS,
  DISTRICT_MAP,
  ANCESTRAL_VILLAGES,
  NAKSHATRAS,
  RASHIS,
  GANAS,
  NADIS,
} from '@/data/formOptions'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gotra: '',
    maritalStatus: '',
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
    currentAddress: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    manglik: '',
    birthTime: '',
    birthPlace: '',
    nakshatra: '',
    rashi: '',
    gana: '',
    nadi: '',
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

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

  // No separate current village field - ancestral villages provided via datalist

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
        // Age will be calculated from dateOfBirth on the server
        gender: formData.gender,
        mobile: formData.mobile,
        fatherOrHusbandName: formData.fatherOrHusbandName,
        motherName: formData.motherName,
        maritalStatus: formData.maritalStatus,
        education: formData.education,
        gotra: formData.gotra,
        motherGotra: formData.motherGotra,
        profession: formData.profession,
        yearlyIncome: formData.yearlyIncome,
        state: formData.state,
        district: formData.district,
        currentAddress: formData.currentAddress,
        ancestralVillage: formData.ancestralVillage,
        dateOfBirth: formData.dateOfBirth,
        manglik: formData.manglik,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        nakshatra: formData.nakshatra,
        rashi: formData.rashi,
        gana: formData.gana,
        nadi: formData.nadi,
      }

      console.log('Submitting registration with payload:', payload)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      // If profile image is selected, upload it
      if (profileImage && data.user?.id) {
        try {
          const imageFormData = new FormData()
          imageFormData.append('file', profileImage)
          imageFormData.append('userId', data.user.id)

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: imageFormData,
          })

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json()

            // Update user profile with image path
            await fetch(`/api/users/${data.user.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ profilePicture: uploadData.filePath }),
            })
          }
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError)
          // Continue anyway - registration was successful
        }
      }

      setSuccess('Registration successful! Redirecting to login...')

      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      console.error('Registration error:', err)
      setError('An error occurred during registration')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Velzon Style */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Rishishwar Matrimonial Logo"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  ऋषीश्वर मैट्रिमोनियल (RISHISHWAR MATRIMONIAL)
                </h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <Link
                    href="/"
                    className="hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                  <span>›</span>
                  <span className="text-gray-700">Registration</span>
                </div>
              </div>
            </div>
            <Link
              href="/login"
              className="text-sm text-primary hover:text-indigo-700 transition-colors font-medium"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Page Title Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            पंजीकरण फॉर्म (Registration Form)
          </h2>
          <p className="text-sm text-gray-600">
            Please fill out all required fields to register your family profile
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-5 py-4 rounded-md mb-6 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Error!</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-800 px-5 py-4 rounded-md mb-6 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Success!</p>
                <p className="text-sm mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Card Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Basic Information
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    मूल जानकारी (Basic Information)
                  </p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="firstName">
                    नाम (Name) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="form-input"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="lastName">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="form-input"
                    placeholder="Enter last name"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="form-label" htmlFor="profileImage">
                    प्रोफाइल फोटो (Profile Picture)
                  </label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="profileImage"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="form-input"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Allowed: JPEG, PNG, WebP. Max size: 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="dateOfBirth">
                    जन्म तिथि (Date of Birth){' '}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="email">
                    Email ID
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="form-input"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="gotra">
                    गोत्र (Gotra) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="gotra"
                    value={formData.gotra}
                    onChange={(e) =>
                      setFormData({ ...formData, gotra: e.target.value })
                    }
                    className="form-input"
                    placeholder="Enter gotra (e.g., Gautam गौतम)"
                    list="gotra-list"
                    required
                  />
                  <datalist id="gotra-list">
                    {GOTRA_OPTIONS.map((gotra) => (
                      <option key={gotra} value={gotra} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="form-label" htmlFor="maritalStatus">
                    विवाह अवस्था (Marital Status){' '}
                    <span className="text-danger">*</span>
                  </label>
                  <select
                    id="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maritalStatus: e.target.value,
                      })
                    }
                    className="form-input"
                    required
                  >
                    <option value="">चुनें</option>
                    {MARITAL_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Age input removed - age will be calculated from dateOfBirth */}

                <div>
                  <label className="form-label" htmlFor="gender">
                    लिंग (Gender) <span className="text-danger">*</span>
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="form-input"
                    required
                  >
                    <option value="">चुनें</option>
                    <option value="Male">पुरुष (Male)</option>
                    <option value="Female">महिला (Female)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" htmlFor="ancestralVillage">
                    पैतृक गांव (Ancestral Village){' '}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="ancestralVillage"
                    value={formData.ancestralVillage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ancestralVillage: e.target.value,
                      })
                    }
                    className="form-input"
                    placeholder="Enter ancestral village"
                    list="village-list"
                    required
                  />
                  <datalist id="village-list">
                    {ANCESTRAL_VILLAGES.map((village) => (
                      <option key={village} value={village} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="form-label" htmlFor="fatherOrHusbandName">
                    Father&apos;s Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="fatherOrHusbandName"
                    value={formData.fatherOrHusbandName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fatherOrHusbandName: e.target.value,
                      })
                    }
                    className="form-input"
                    placeholder="Enter father's name"
                    required
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="mobile">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    placeholder="10 digit number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="motherName">
                    Mother&apos;s Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="motherName"
                    value={formData.motherName}
                    onChange={(e) =>
                      setFormData({ ...formData, motherName: e.target.value })
                    }
                    className="form-input"
                    placeholder="Enter mother's name"
                    required
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="motherGotra">
                    Mother&apos;s Gotra (माता का गोत्र){' '}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="motherGotra"
                    value={formData.motherGotra}
                    onChange={(e) =>
                      setFormData({ ...formData, motherGotra: e.target.value })
                    }
                    className="form-input"
                    placeholder="Enter mother's gotra"
                    list="mother-gotra-list"
                    required
                  />
                  <datalist id="mother-gotra-list">
                    {GOTRA_OPTIONS.map((gotra) => (
                      <option key={gotra} value={gotra} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="form-label" htmlFor="manglik">
                    मांगलिक (Manglik)
                  </label>
                  <select
                    id="manglik"
                    value={formData.manglik}
                    onChange={(e) =>
                      setFormData({ ...formData, manglik: e.target.value })
                    }
                    className="form-input"
                  >
                    <option value="">चुनें</option>
                    <option value="YES">हाँ (Yes)</option>
                    <option value="NO">नहीं (No)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" htmlFor="birthTime">
                    जन्म समय (Birth Time)
                  </label>
                  <input
                    type="time"
                    id="birthTime"
                    value={formData.birthTime}
                    onChange={(e) =>
                      setFormData({ ...formData, birthTime: e.target.value })
                    }
                    className="form-input"
                    placeholder="Enter birth time"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="birthPlace">
                    जन्म स्थान (Birth Place)
                  </label>
                  <input
                    type="text"
                    id="birthPlace"
                    value={formData.birthPlace}
                    onChange={(e) =>
                      setFormData({ ...formData, birthPlace: e.target.value })
                    }
                    className="form-input"
                    placeholder="Enter birth place"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="nakshatra">
                    नक्षत्र (Nakshatra - Birth Star)
                  </label>
                  <select
                    id="nakshatra"
                    value={formData.nakshatra}
                    onChange={(e) =>
                      setFormData({ ...formData, nakshatra: e.target.value })
                    }
                    className="form-input"
                  >
                    <option value="">चुनें / Select</option>
                    {NAKSHATRAS.map((nakshatra) => (
                      <option key={nakshatra} value={nakshatra}>
                        {nakshatra}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" htmlFor="rashi">
                    राशि (Rashi - Moon Sign)
                  </label>
                  <select
                    id="rashi"
                    value={formData.rashi}
                    onChange={(e) =>
                      setFormData({ ...formData, rashi: e.target.value })
                    }
                    className="form-input"
                  >
                    <option value="">चुनें / Select</option>
                    {RASHIS.map((rashi) => (
                      <option key={rashi} value={rashi}>
                        {rashi}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" htmlFor="gana">
                    गण (Gana - Temperament)
                  </label>
                  <select
                    id="gana"
                    value={formData.gana}
                    onChange={(e) =>
                      setFormData({ ...formData, gana: e.target.value })
                    }
                    className="form-input"
                  >
                    <option value="">चुनें / Select</option>
                    {GANAS.map((gana) => (
                      <option key={gana} value={gana}>
                        {gana}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" htmlFor="nadi">
                    नाड़ी (Nadi)
                  </label>
                  <select
                    id="nadi"
                    value={formData.nadi}
                    onChange={(e) =>
                      setFormData({ ...formData, nadi: e.target.value })
                    }
                    className="form-input"
                  >
                    <option value="">चुनें / Select</option>
                    {NADIS.map((nadi) => (
                      <option key={nadi} value={nadi}>
                        {nadi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Educational & Professional Details Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Card Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Educational & Professional Details
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    शैक्षिक और व्यावसायिक विवरण
                  </p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="education">
                    शिक्षा (Education) <span className="text-danger">*</span>
                  </label>
                  <select
                    id="education"
                    value={formData.education}
                    onChange={(e) =>
                      setFormData({ ...formData, education: e.target.value })
                    }
                    className="form-input"
                    required
                  >
                    <option value="">चुनें</option>
                    {EDUCATION_OPTIONS.map((edu) => (
                      <option key={edu} value={edu}>
                        {edu}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" htmlFor="profession">
                    पेशा (Profession) <span className="text-danger">*</span>
                  </label>
                  <select
                    id="profession"
                    value={formData.profession}
                    onChange={(e) =>
                      setFormData({ ...formData, profession: e.target.value })
                    }
                    className="form-input"
                    required
                  >
                    <option value="">चुनें</option>
                    {PROFESSION_OPTIONS.map((prof) => (
                      <option key={prof} value={prof}>
                        {prof}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Yearly Income - hide for गृह कार्य or अध्ययन or अन्य पेशा */}
                {formData.profession &&
                  formData.profession !== 'अन्य पेशा' &&
                  formData.profession !== 'गृह कार्य' &&
                  formData.profession !== 'अध्ययन' && (
                    <div>
                      <label className="form-label" htmlFor="yearlyIncome">
                        वार्षिक आय (Yearly Income){' '}
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        id="yearlyIncome"
                        value={formData.yearlyIncome}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            yearlyIncome: e.target.value,
                          })
                        }
                        className="form-input"
                        required
                      >
                        <option value="">चुनें</option>
                        <option value="Less than 3 Lakh">
                          Less than 3 Lakh
                        </option>
                        <option value="3 Lakh to 6 Lakh">
                          3 Lakh to 6 Lakh
                        </option>
                        <option value="6 Lakh to 12 Lakh">
                          6 Lakh to 12 Lakh
                        </option>
                        <option value="12 Lakh to 18 Lakh">
                          12 Lakh to 18 Lakh
                        </option>
                        <option value="18 Lakh to 25 Lakh">
                          18 Lakh to 25 Lakh
                        </option>
                        <option value="25 Lakh to 35 Lakh">
                          25 Lakh to 35 Lakh
                        </option>
                        <option value="35 Lakh to 40 Lakh">
                          35 Lakh to 40 Lakh
                        </option>
                        <option value="More than 40 Lakh">
                          More than 40 Lakh
                        </option>
                      </select>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Address Details Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Card Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center text-white font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Address Details
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">पता विवरण</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label" htmlFor="state">
                    राज्य (State) <span className="text-danger">*</span>
                  </label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">चुनें</option>
                    {STATE_OPTIONS.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" htmlFor="district">
                    जिला (District) <span className="text-danger">*</span>
                  </label>
                  <select
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="form-input"
                    disabled={!formData.state}
                    required
                  >
                    <option value="">चुनें</option>
                    {districtOptions.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Current Village field removed as per requirements */}
              </div>

              <div className="mt-4">
                <label className="form-label" htmlFor="currentAddress">
                  पूरा पता (Full Address) <span className="text-danger">*</span>
                </label>
                <textarea
                  id="currentAddress"
                  value={formData.currentAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, currentAddress: e.target.value })
                  }
                  rows={2}
                  placeholder="House No., Street, Landmark, etc."
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Account Security Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Card Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-600 rounded-md flex items-center justify-center text-white font-semibold text-sm">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Account Security
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">खाता सुरक्षा</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label" htmlFor="password">
                    पासवर्ड (Password) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="form-input"
                    required
                    minLength={6}
                  />
                  <p className="text-sm text-muted mt-1">
                    Minimum 6 characters
                  </p>
                </div>

                <div>
                  <label className="form-label" htmlFor="confirmPassword">
                    पासवर्ड पुष्टि (Confirm Password){' '}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary px-8 py-2.5"
            >
              {loading
                ? 'जमा हो रहा है... (Submitting...)'
                : 'जमा करें (Submit Registration)'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors duration-200"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
