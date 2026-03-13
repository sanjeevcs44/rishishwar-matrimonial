import type { Meta, StoryObj } from '@storybook/react'
import { Alert, AlertDescription } from './Alert'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertDescription>This is a default alert message</AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertDescription>This is a destructive alert message</AlertDescription>
    </Alert>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertDescription className="flex items-center gap-2">
        <span>⚠️</span> An error has occurred
      </AlertDescription>
    </Alert>
  ),
}

export const Success: Story = {
  render: () => (
    <Alert className="border-green-200 bg-green-50">
      <AlertDescription className="text-green-800">
        <span className="flex items-center gap-2">
          <span>✓</span> Operation completed successfully
        </span>
      </AlertDescription>
    </Alert>
  ),
}

export const Info: Story = {
  render: () => (
    <Alert className="border-blue-200 bg-blue-50">
      <AlertDescription className="text-blue-800">
        <span className="flex items-center gap-2">
          <span>ℹ️</span> This is informational content
        </span>
      </AlertDescription>
    </Alert>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>Default alert</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertDescription>Destructive alert</AlertDescription>
      </Alert>
      <Alert className="border-green-200 bg-green-50">
        <AlertDescription className="text-green-800">
          Success alert
        </AlertDescription>
      </Alert>
      <Alert className="border-blue-200 bg-blue-50">
        <AlertDescription className="text-blue-800">
          Info alert
        </AlertDescription>
      </Alert>
    </div>
  ),
}
