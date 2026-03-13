import type { Meta } from '@storybook/react'
import { Dialog } from './Dialog'
import { Button } from './Button'
import { useState } from 'react'

const DialogExample = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Dialog Title</h2>
          <p>This is the dialog content. You can put any content here.</p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Confirm</Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

const ConfirmDialogExample = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="destructive">
        Delete Item
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Confirm Delete</h2>
          <p>
            Are you sure you want to delete this item? This action cannot be
            undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsOpen(false)
                alert('Item deleted')
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

const FormDialogExample = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Edit Profile</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Save Changes</Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>

export default meta

export const Default = {
  render: () => <DialogExample />,
}

export const ConfirmDialog = {
  render: () => <ConfirmDialogExample />,
}

export const FormDialog = {
  render: () => <FormDialogExample />,
}
