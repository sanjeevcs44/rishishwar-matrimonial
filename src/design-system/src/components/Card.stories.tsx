import type { Meta, StoryObj } from '@storybook/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content area with your component details</p>
      </CardContent>
    </Card>
  ),
}

export const WithContent: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
        <CardDescription>View product information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Product Name:</strong> Laser Toner Cartridge
          </p>
          <p>
            <strong>SKU:</strong> LTC-001
          </p>
          <p>
            <strong>Price:</strong> $49.99
          </p>
          <p>
            <strong>In Stock:</strong> Yes
          </p>
        </div>
      </CardContent>
    </Card>
  ),
}

export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Card 1</CardTitle>
        </CardHeader>
        <CardContent>
          <p>First card content</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Card 2</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Second card content</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Card 3</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Third card content</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const MinimalCard: Story = {
  render: () => (
    <Card className="w-full max-w-sm">
      <CardContent className="pt-6">
        <p>Simple card with just content</p>
      </CardContent>
    </Card>
  ),
}
