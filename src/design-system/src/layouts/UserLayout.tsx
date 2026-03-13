import { type ReactNode } from 'react'
import { Button, Badge } from '../components'
import { FiLogOut, FiUser } from 'react-icons/fi'
import { tokenManager } from '../utils/tokenManager'

interface UserLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  onLogout?: () => void
}

/**
 * UserLayout Component
 *
 * A reusable layout wrapper for authenticated user pages.
 * Provides consistent header with user info, logout functionality,
 * and main content area.
 */
export function UserLayout({
  children,
  title = 'Purchase Order',
  subtitle = 'Purchase Order Management',
  onLogout,
}: UserLayoutProps) {
  const userData = tokenManager.getUserData()

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#f5f5f5] to-[#fafafa] shadow-lg">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-500">{subtitle}</p>
              </div>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-4">
              {/* User Details */}
              {userData && (
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-gray-500" />
                    <p className="text-sm font-medium text-gray-900">
                      {userData.username}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">{userData.email}</p>
                  <Badge
                    variant="secondary"
                    className="mt-1 bg-green-100 text-green-800 border-0 hover:bg-green-100"
                  >
                    {userData.role}
                  </Badge>
                </div>
              )}

              {/* Logout Button */}
              {onLogout && (
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="flex items-center gap-2 shadow-md bg-red-500 hover:bg-red-600 text-white border-2 border-red-500 hover:border-red-600"
                >
                  <FiLogOut />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 sm:px-6 lg:px-8 py-12 flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#f5f5f5] to-[#fafafa] shadow-lg mt-auto">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center">
            <p className="text-sm text-gray-600">
              Copyright © {new Date().getFullYear()} Lipi Data Systems Ltd. All
              Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
