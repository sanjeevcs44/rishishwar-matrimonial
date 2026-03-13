import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'date'],
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    type: 'text',
  },
}

export const Email: Story = {
  args: {
    placeholder: 'Enter email...',
    type: 'email',
  },
}

export const Password: Story = {
  args: {
    placeholder: 'Enter password...',
    type: 'password',
  },
}

export const Number: Story = {
  args: {
    placeholder: 'Enter number...',
    type: 'number',
  },
}

export const Date: Story = {
  args: {
    placeholder: 'Select date...',
    type: 'date',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
}

export const AllTypes: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <div>
        <label className="text-sm font-medium">Text Input</label>
        <Input placeholder="Enter text..." type="text" />
      </div>
      <div>
        <label className="text-sm font-medium">Email Input</label>
        <Input placeholder="Enter email..." type="email" />
      </div>
      <div>
        <label className="text-sm font-medium">Password Input</label>
        <Input placeholder="Enter password..." type="password" />
      </div>
      <div>
        <label className="text-sm font-medium">Number Input</label>
        <Input placeholder="Enter number..." type="number" />
      </div>
      <div>
        <label className="text-sm font-medium">Date Input</label>
        <Input placeholder="Select date..." type="date" />
      </div>
      <div>
        <label className="text-sm font-medium">Disabled Input</label>
        <Input placeholder="Disabled" disabled />
      </div>
    </div>
  ),
}
