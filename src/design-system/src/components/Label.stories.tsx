import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './Label'

const meta = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Label',
  },
}

export const WithForm: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <Label htmlFor="checkbox">
          <input type="checkbox" id="checkbox" className="mr-2" />
          Remember me
        </Label>
      </div>
    </div>
  ),
}

export const MultipleLabels: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Label>First Name</Label>
      </div>
      <div>
        <Label>Last Name</Label>
      </div>
      <div>
        <Label>Company</Label>
      </div>
      <div>
        <Label>Job Title</Label>
      </div>
    </div>
  ),
}
