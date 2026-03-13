import { type ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

/**
 * AuthLayout Component
 *
 * A layout for authentication pages (Login, Register, Forgot Password).
 * Provides a centered card layout with gradient background.
 * No header or navigation - focused on authentication flow.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 p-4">
      {children}
    </div>
  )
}
