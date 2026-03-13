import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Test/Simple',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const SimpleTest: Story = {
  render: () => <div>Hello World</div>,
}
