import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const dialogContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog Content */}
      {children}
    </div>
  )

  // Use portal to render at document body level
  return typeof document !== 'undefined'
    ? createPortal(dialogContent, document.body)
    : dialogContent
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

export function DialogContent({
  children,
  className = '',
}: DialogContentProps) {
  return (
    <div
      className={`relative z-10 bg-white rounded-lg shadow-xl w-full max-w-lg min-w-[32rem] max-h-[90vh] overflow-y-auto ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

export function DialogHeader({ children, className = '' }: DialogHeaderProps) {
  return <div className={`px-6 py-4 border-b ${className}`}>{children}</div>
}

interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

export function DialogTitle({ children, className = '' }: DialogTitleProps) {
  return (
    <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  )
}

interface DialogBodyProps {
  children: React.ReactNode
  className?: string
}

export function DialogBody({ children, className = '' }: DialogBodyProps) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>
}

interface DialogFooterProps {
  children: React.ReactNode
  className?: string
}

export function DialogFooter({ children, className = '' }: DialogFooterProps) {
  return (
    <div className={`px-6 py-4 border-t flex justify-end gap-3 ${className}`}>
      {children}
    </div>
  )
}
