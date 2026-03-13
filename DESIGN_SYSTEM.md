# 🎨 Matrimonial App - Design System

## Overview

This design system provides a comprehensive, customizable theme for the matrimonial application. It's built with CSS variables (custom properties) for easy theme switching and maintenance.

## 📁 File Structure

```
/src
  /config
    theme.ts          # TypeScript theme configuration
  /styles
    theme.css         # CSS variables and utility classes
  /app
    globals.css       # Global styles with theme import
```

## 🎨 Color Palette

### Primary Colors (Indigo)

Used for main actions, primary buttons, and key UI elements.

| Shade | Hex     | Usage                  |
| ----- | ------- | ---------------------- |
| 50    | #f0f3ff | Lightest background    |
| 100   | #e0e7ff | Light background       |
| 600   | #4f46e5 | **Main primary color** |
| 900   | #312e81 | Darkest shade          |

**CSS Variable**: `var(--primary)` or `var(--primary-600)`

### Secondary Colors (Pink/Magenta)

Used for secondary actions and accent elements.

| Shade | Hex     | Usage                    |
| ----- | ------- | ------------------------ |
| 500   | #d946ef | **Main secondary color** |

**CSS Variable**: `var(--secondary)` or `var(--secondary-500)`

### Semantic Colors

**Success (Green)** - `var(--success)` or `#16a34a`

- Used for: Approved status, success messages, positive actions

**Warning (Yellow)** - `var(--warning)` or `#f59e0b`

- Used for: Pending status, warning messages, caution alerts

**Danger (Red)** - `var(--danger)` or `#dc2626`

- Used for: Rejected status, error messages, destructive actions

**Info (Blue)** - `var(--info)` or `#2563eb`

- Used for: Information messages, moderator badges

## 🔧 How to Use

### 1. CSS Variables (Recommended)

Use CSS variables directly in your component styles:

```tsx
// In a component
<div
  style={{
    backgroundColor: 'var(--primary)',
    color: 'var(--text-white)',
    padding: 'var(--spacing-md)',
  }}
>
  Primary Button
</div>
```

### 2. Utility Classes

Use pre-built utility classes:

```tsx
<button className="btn btn-primary">
  Click Me
</button>

<div className="card">
  <div className="card-header">
    Header
  </div>
</div>
```

### 3. TypeScript Config (Type-Safe)

Import theme configuration for type safety:

```tsx
import { theme, getCSSVar } from '@/config/theme'

// Get color value
const primaryColor = theme.colors.primary[600]

// Get CSS variable
const primaryVar = getCSSVar('primary')
```

## 🎯 Utility Classes

### Buttons

```html
<!-- Primary Button -->
<button class="btn btn-primary">Primary</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Secondary</button>

<!-- Outline Button -->
<button class="btn btn-outline-primary">Outline</button>

<!-- Danger Button -->
<button class="btn btn-danger">Delete</button>
```

**Available Classes:**

- `.btn` - Base button styles
- `.btn-primary` - Primary button (indigo)
- `.btn-secondary` - Secondary button (pink)
- `.btn-success` - Success button (green)
- `.btn-warning` - Warning button (yellow)
- `.btn-danger` - Danger button (red)
- `.btn-outline-primary` - Outline primary button

### Cards

```html
<div class="card">
  <div class="card-header">Card Title</div>
  <p>Card content goes here</p>
</div>
```

**Available Classes:**

- `.card` - Base card styles with shadow and hover effect
- `.card-header` - Card header with bottom border

### Badges

```html
<span class="badge badge-success">Approved</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-danger">Rejected</span>
```

**Available Classes:**

- `.badge` - Base badge styles
- `.badge-primary`, `.badge-secondary`, `.badge-success`, `.badge-warning`, `.badge-danger`, `.badge-info`

### Form Inputs

```html
<label class="form-label" for="email">Email</label>
<input type="email" id="email" class="form-input" placeholder="Enter email" />
```

**Available Classes:**

- `.form-label` - Styled form labels
- `.form-input` - Styled form inputs with focus states

### Backgrounds

```html
<div class="bg-primary">Primary Background</div>
<div class="bg-gradient-primary">Gradient Background</div>
```

### Text Colors

```html
<p class="text-primary">Primary Text</p>
<p class="text-success">Success Text</p>
<p class="text-danger">Danger Text</p>
```

### Shadows

```html
<div class="shadow-sm">Small shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-2xl">Extra large shadow</div>
```

## 📐 Spacing System

Use consistent spacing throughout the app:

| Variable        | Value   | Pixels |
| --------------- | ------- | ------ |
| `--spacing-xs`  | 0.25rem | 4px    |
| `--spacing-sm`  | 0.5rem  | 8px    |
| `--spacing-md`  | 1rem    | 16px   |
| `--spacing-lg`  | 1.5rem  | 24px   |
| `--spacing-xl`  | 2rem    | 32px   |
| `--spacing-2xl` | 3rem    | 48px   |
| `--spacing-3xl` | 4rem    | 64px   |

**Example:**

```css
.my-component {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}
```

## 📝 Typography

### Font Sizes

| Variable      | Size     | Pixels |
| ------------- | -------- | ------ |
| `--text-xs`   | 0.75rem  | 12px   |
| `--text-sm`   | 0.875rem | 14px   |
| `--text-base` | 1rem     | 16px   |
| `--text-lg`   | 1.125rem | 18px   |
| `--text-xl`   | 1.25rem  | 20px   |
| `--text-2xl`  | 1.5rem   | 24px   |
| `--text-3xl`  | 1.875rem | 30px   |
| `--text-4xl`  | 2.25rem  | 36px   |
| `--text-5xl`  | 3rem     | 48px   |

### Font Weights

| Variable           | Value |
| ------------------ | ----- |
| `--font-light`     | 300   |
| `--font-normal`    | 400   |
| `--font-medium`    | 500   |
| `--font-semibold`  | 600   |
| `--font-bold`      | 700   |
| `--font-extrabold` | 800   |

## 🔄 Animations

Pre-built animations with utility classes:

```html
<div class="animate-fadeIn">Fades in</div>
<div class="animate-slideUp">Slides up</div>
<div class="animate-slideDown">Slides down</div>
```

**Available Animations:**

- `@keyframes fadeIn` - Fade in from opacity 0 to 1
- `@keyframes slideUp` - Slide up from bottom
- `@keyframes slideDown` - Slide down from top

## 🎨 Customizing the Theme

### Method 1: Update CSS Variables (Quick)

Edit `/src/styles/theme.css` and change the root variables:

```css
:root {
  /* Change primary color from indigo to blue */
  --primary: #2563eb;
  --primary-hover: #1d4ed8;

  /* Change spacing */
  --spacing-md: 1.25rem;
}
```

### Method 2: Update TypeScript Config (Recommended)

Edit `/src/config/theme.ts` and run a script to regenerate CSS:

```typescript
export const theme = {
  colors: {
    primary: {
      600: '#2563eb', // Changed to blue
      // ... other shades
    },
  },
}
```

### Creating Theme Variants

You can create multiple theme files for different color schemes:

```
/src/styles
  theme.css           # Default theme (Indigo)
  theme-blue.css      # Blue theme
  theme-green.css     # Green theme
  theme-dark.css      # Dark mode
```

Then switch themes by importing different files or dynamically with JavaScript.

## 📱 Responsive Design

The design system is mobile-first with breakpoint adjustments:

```css
/* Mobile first (default) */
.text-responsive {
  font-size: var(--text-base);
}

/* Tablet and up */
@media (min-width: 768px) {
  .text-responsive {
    font-size: var(--text-lg);
  }
}
```

## 🎯 Component Examples

### Primary Button

```tsx
<button className="btn btn-primary">Click Me</button>
```

### Card with Header

```tsx
<div className="card">
  <div className="card-header">
    <h3>Profile Details</h3>
  </div>
  <p>Card content here...</p>
</div>
```

### Status Badge

```tsx
{
  user.approvalStatus === 'APPROVED' && (
    <span className="badge badge-success">Approved</span>
  )
}
{
  user.approvalStatus === 'PENDING' && (
    <span className="badge badge-warning">Pending</span>
  )
}
{
  user.approvalStatus === 'REJECTED' && (
    <span className="badge badge-danger">Rejected</span>
  )
}
```

### Form Input

```tsx
<div>
  <label htmlFor="email" className="form-label">
    Email Address
  </label>
  <input
    id="email"
    type="email"
    className="form-input"
    placeholder="Enter your email"
  />
</div>
```

## 🔍 Design Tokens Reference

All design tokens are available as CSS variables:

### Colors

- `--primary-{50-900}` - Primary color scale
- `--secondary-{50-900}` - Secondary color scale
- `--success-{50-900}` - Success color scale
- `--warning-{50-900}` - Warning color scale
- `--danger-{50-900}` - Danger color scale
- `--info-{50-900}` - Info color scale
- `--gray-{50-900}` - Gray scale

### Text Colors

- `--text-primary` - Main text color (gray-900)
- `--text-secondary` - Secondary text (gray-600)
- `--text-muted` - Muted text (gray-500)
- `--text-disabled` - Disabled text (gray-400)

### Backgrounds

- `--bg-primary` - Main background (white)
- `--bg-secondary` - Secondary background (gray-50)
- `--bg-tertiary` - Tertiary background (gray-100)
- `--bg-gradient-{type}` - Gradient backgrounds

### Borders

- `--border-color` - Default border (gray-200)
- `--border-light` - Light border (gray-100)
- `--border-dark` - Dark border (gray-300)

### Shadows

- `--shadow-sm` through `--shadow-2xl` - Shadow scale

### Other

- `--radius-{size}` - Border radius scale
- `--transition-{speed}` - Transition durations
- `--z-{layer}` - Z-index layers

## 📚 Best Practices

1. **Always use CSS variables** instead of hardcoded colors
2. **Use utility classes** for common patterns (buttons, badges, cards)
3. **Follow the spacing system** for consistent layouts
4. **Use semantic colors** (success, warning, danger) appropriately
5. **Keep theme customization in one place** (theme.css or theme.ts)
6. **Test theme changes** across all pages before deploying

## 🚀 Next Steps

1. Update existing pages to use utility classes
2. Replace Tailwind colors with CSS variables
3. Create theme switcher component (optional)
4. Add dark mode support (optional)
5. Document component library with examples

## 📖 Resources

- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Velzon Template (Inspiration)](https://themesbrand.com/velzon/)
- [Design Tokens (W3C)](https://www.w3.org/community/design-tokens/)

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Maintainer:** Matrimonial App Development Team
