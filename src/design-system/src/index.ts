/**
 * @dataxis/lds-design-system
 *
 * Dataxis LDS Design System
 * Reusable UI components and layouts for micro frontend applications
 *
 * @version 1.0.0
 * @author Dataxis Labs
 * @license PRIVATE
 */

// ========================================
// Component Exports
// ========================================
export {
  Button,
  buttonVariants,
  type ButtonProps,
  Input,
  type InputProps,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  Alert,
  AlertTitle,
  AlertDescription,
  Badge,
  badgeVariants,
  type BadgeProps,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  Label,
} from './components'

// ========================================
// Layout Exports
// ========================================
export { AuthLayout, UserLayout } from './layouts'

// ========================================
// Utility Exports (UI only)
// ========================================
export { cn } from './utils'
