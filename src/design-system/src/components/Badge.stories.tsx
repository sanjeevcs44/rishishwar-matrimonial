import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}

export const WithContent: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge>New</Badge>
        <Badge variant="secondary">Featured</Badge>
        <Badge variant="destructive">Important</Badge>
        <Badge variant="outline">Coming Soon</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge>Active</Badge>
        <Badge variant="secondary">Pending</Badge>
        <Badge variant="destructive">Failed</Badge>
      </div>
    </div>
  ),
}

export const StatusBadges: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span>Order Status:</span>
        <Badge>Completed</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Payment Status:</span>
        <Badge variant="secondary">Processing</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Inventory:</span>
        <Badge>In Stock</Badge>
      </div>
    </div>
  ),
}
