'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Call login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: formData.mobile,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // Store user data in localStorage for session management
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('currentUser', JSON.stringify(data.user))

      // Redirect based on user role
      if (data.user.role === 'MODERATOR') {
        router.push('/moderator/dashboard')
      } else {
        router.push('/home')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred during login')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Logo Panel - top on mobile, left on desktop */}
      <div className="w-full md:w-1/2 relative bg-gradient-to-br from-pink-600 to-purple-700 flex items-center justify-center overflow-hidden py-12 md:py-0 md:min-h-screen">
        {/* Background decorative circles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-white"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white"></div>
        </div>
        {/* Logo centered */}
        <div className="relative z-10 flex flex-col items-center gap-4 px-10 text-center">
          <img
            src="/logo.png"
            alt="Rishishwar Matrimonial Logo"
            className="w-40 h-40 md:w-64 md:h-64 object-contain drop-shadow-2xl"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            ऋषीश्वर मैट्रिमोनियल
          </h1>
          <p className="text-pink-100 text-base md:text-lg font-medium">
            Rishishwar Matrimonial
          </p>
          <p className="text-pink-200 text-sm">
            Maintained by Rishishwar Volunteers
          </p>
        </div>
      </div>

      {/* Login Form - bottom on mobile, right on desktop */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              Welcome Back!
            </h2>
            <p className="text-gray-500 mb-8">Sign in to your account</p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-1"
                  htmlFor="mobile"
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  placeholder="Enter 10 digit mobile number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold text-gray-700 mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center mt-6 text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-purple-600 hover:text-purple-800 font-semibold"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
