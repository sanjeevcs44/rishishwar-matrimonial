'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  MdAdminPanelSettings,
  MdPeople,
  MdCheckCircle,
  MdPending,
  MdCancel,
  MdArrowBack,
  MdSearch,
} from 'react-icons/md'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

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
  state: string | null
  district: string | null
  gotra: string | null
  ancestralVillage: string | null
  assignedVillage: string | null
  maritalStatus: string | null
  profilePicture: string | null
  role: string
  approvalStatus: string
  createdAt: string
}

interface Stats {
  totalUsers: number
  approved: number
  pending: number
  rejected: number
  admins: number
  moderators: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    admins: 0,
    moderators: 0,
  })
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Helper function to extract Hindi part from combined value
  const formatCombinedValue = (value: string | null): string => {
    if (!value) return 'N/A'
    const parts = value.split('-')
    return parts.length > 1 ? parts[1] : value
  }

  useEffect(() => {
    const fetchData = async () => {
      // Check if user is logged in and is admin
      const isLoggedIn = localStorage.getItem('isLoggedIn')
      if (isLoggedIn !== 'true') {
        router.push('/login')
        return
      }

      const currentUserStr = localStorage.getItem('currentUser')
      if (!currentUserStr) {
        router.push('/login')
        return
      }

      const user = JSON.parse(currentUserStr)
      setCurrentUser(user)

      // Check if user is admin only (moderators cannot access)
      if (user.role !== 'ADMIN') {
        router.push('/home')
        return
      }

      try {
        // Fetch all users
        const response = await fetch('/api/users')
        const data = await response.json()

        if (response.ok) {
          const allUsers = data.users
          setUsers(allUsers)

          // Calculate stats
          const totalUsers = allUsers.length
          const approved = allUsers.filter(
            (u: User) => u.approvalStatus === 'APPROVED',
          ).length
          const pending = allUsers.filter(
            (u: User) => u.approvalStatus === 'PENDING',
          ).length
          const rejected = allUsers.filter(
            (u: User) => u.approvalStatus === 'REJECTED',
          ).length
          const admins = allUsers.filter((u: User) => u.role === 'ADMIN').length
          const moderators = allUsers.filter(
            (u: User) => u.role === 'MODERATOR',
          ).length

          setStats({
            totalUsers,
            approved,
            pending,
            rejected,
            admins,
            moderators,
          })
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }

      setLoading(false)
    }

    fetchData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  const handleBackToHome = () => {
    router.push('/home')
  }

  const filteredUsers = users.filter((user) => {
    // Filter by tab
    const matchesTab =
      selectedTab === 'all' || user.approvalStatus === selectedTab.toUpperCase()

    // Filter by search query
    const matchesSearch =
      searchQuery === '' ||
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.mobile.includes(searchQuery) ||
      (user.email &&
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.education &&
        user.education.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.profession &&
        user.profession.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.district &&
        user.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.state &&
        user.state.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.gotra &&
        user.gotra.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.ancestralVillage &&
        user.ancestralVillage.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesTab && matchesSearch
  })

  // Chart data
  const approvalData = [
    { name: 'Approved', value: stats.approved, color: '#10b981' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Rejected', value: stats.rejected, color: '#ef4444' },
  ]

  const roleData = [
    {
      name: 'Regular Users',
      value: stats.totalUsers - stats.admins - stats.moderators,
    },
    { name: 'Moderators', value: stats.moderators },
    { name: 'Admins', value: stats.admins },
  ]

  const genderData = [
    {
      name: 'Male',
      count: users.filter((u) => u.gender === 'Male').length,
    },
    {
      name: 'Female',
      count: users.filter((u) => u.gender === 'Female').length,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Rishishwar Matrimonial Logo"
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold">
                  ऋषीश्वर मैट्रिमोनियल - Admin Dashboard
                </h1>
                <p className="text-purple-200">
                  Welcome, {currentUser?.firstName}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBackToHome}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition duration-200 flex items-center gap-2"
              >
                <MdArrowBack />
                Back to Home
              </button>
              <button
                onClick={handleLogout}
                className="bg-purple-700 hover:bg-purple-800 px-6 py-2 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.totalUsers}
                </p>
              </div>
              <MdPeople className="text-5xl text-blue-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase">
                  Approved
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.approved}
                </p>
              </div>
              <MdCheckCircle className="text-5xl text-green-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase">
                  Pending
                </p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {stats.pending}
                </p>
              </div>
              <MdPending className="text-5xl text-yellow-500" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase">
                  Rejected
                </p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {stats.rejected}
                </p>
              </div>
              <MdCancel className="text-5xl text-red-500" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Approval Status Pie Chart */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Approval Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={approvalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {approvalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gender Distribution Bar Chart */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Gender Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Moderators Contact Table */}
        <div className="card mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MdPeople className="text-blue-600" />
            Moderators Contact Information
          </h3>

          {users.filter((u) => u.role === 'MODERATOR').length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No moderators found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Contact Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Assigned Village
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Gotra
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users
                    .filter((u) => u.role === 'MODERATOR')
                    .map((moderator, index) => (
                      <tr key={moderator.id} className="hover:bg-blue-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-gray-900">
                              {moderator.firstName} {moderator.lastName}
                            </div>
                            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                              <MdPeople className="text-xs" />
                              Moderator
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <a
                            href={`tel:${moderator.mobile}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {moderator.mobile}
                          </a>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {moderator.email ? (
                            <a
                              href={`mailto:${moderator.email}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {moderator.email}
                            </a>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatCombinedValue(
                            moderator.assignedVillage ||
                              moderator.ancestralVillage,
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {moderator.district && moderator.state
                            ? `${moderator.district}, ${moderator.state}`
                            : 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {moderator.gotra || 'N/A'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">
              User Management
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/admin/add-user')}
                className="btn btn-primary transition duration-200 flex items-center gap-2 shadow-md"
              >
                <MdPeople />
                Add User
              </button>
              <button
                onClick={() => router.push('/admin/add-moderator')}
                className="btn btn-info transition duration-200 flex items-center gap-2 shadow-md"
              >
                <MdAdminPanelSettings />
                Add Moderator
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MdSearch className="text-gray-400 text-xl" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, mobile, email, gotra, village, education, profession, or location..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <MdCancel className="text-xl" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-2">
                Found {filteredUsers.length} result
                {filteredUsers.length !== 1 ? 's' : ''} for &quot;{searchQuery}
                &quot;
              </p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-6 py-3 font-semibold transition-colors ${
                selectedTab === 'all'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Users ({users.length})
            </button>
            <button
              onClick={() => setSelectedTab('pending')}
              className={`px-6 py-3 font-semibold transition-colors ${
                selectedTab === 'pending'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setSelectedTab('approved')}
              className={`px-6 py-3 font-semibold transition-colors ${
                selectedTab === 'approved'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setSelectedTab('rejected')}
              className={`px-6 py-3 font-semibold transition-colors ${
                selectedTab === 'rejected'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Age / Gender
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Gotra
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ancestral Village
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Education
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Profession
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-opacity-70 ${
                      user.approvalStatus === 'APPROVED'
                        ? 'bg-green-50 hover:bg-green-100'
                        : user.approvalStatus === 'PENDING'
                          ? 'bg-yellow-50 hover:bg-yellow-100'
                          : 'bg-red-50 hover:bg-red-100'
                    }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <span className="text-white text-sm font-bold">
                              {user.firstName.charAt(0)}
                              {user.lastName.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.mobile}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.age} / {user.gender}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.district}, {user.state}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.gotra || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.ancestralVillage || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.education || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {user.profession || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'ADMIN'
                            ? 'bg-yellow-100 text-yellow-800'
                            : user.role === 'MODERATOR'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.approvalStatus === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : user.approvalStatus === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.approvalStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => router.push(`/admin/profile/${user.id}`)}
                        className="text-purple-600 hover:text-purple-900 font-medium underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No users found in this category.
              </p>
            </div>
          )}
        </div>
      </div>

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
