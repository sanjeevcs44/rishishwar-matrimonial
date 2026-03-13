# @dataxis/lds-design-system

**Dataxis LDS Shared UI Component Library**

This package contains reusable UI components, layouts, and presentation utilities used across the LDS micro-frontend applications.

## What you'll find

- React UI components (Button, Input, Card, Alert, Badge, Dialog, Label)
- Page layouts (AuthLayout, UserLayout)
- Utilities (cn - className merger for Tailwind)

**Note**: For authentication, API configuration, and business logic, see `@dataxis/lds-auth-lib`.

## Installation (for app developers)

```bash
npm install @dataxis/lds-design-system
```

## Local development (contributors)

```bash
# from the design-system folder
npm install

# build the library (outputs to dist/)
npm run build

# optional: run in watch/dev mode if available
npm run dev
```

## Usage Examples

Import UI components:

```tsx
import { Button, Input, Card, AuthLayout } from '@dataxis/lds-design-system'

function Example() {
  return (
    <AuthLayout>
      <Card>
        <Input placeholder="Name" />
        <Button>Submit</Button>
      </Card>
    </AuthLayout>
  )
}
```

For authentication and API calls, use the auth-lib package:

```tsx
import { useAuth, tokenManager, axiosInstance } from '@dataxis/lds-auth-lib'
```

## Build & Publish

- `npm run build` — builds the library into `dist/`.
- `npm run typecheck` — runs TypeScript declaration generation.
- Publish to your registry using standard `npm publish` workflows.

## Tests & Linting

- `npm run test` — run unit tests for this package (if any).
- `npm run lint` — run ESLint.

## Contributing

- Follow the existing component patterns.
- Add unit tests and stories (locally) for new components.
- Keep accessibility in mind (semantic markup, ARIA where appropriate).

If you'd like, I can add back Storybook instructions later — I removed them per your request to leave Storybook details out for now.
| Input | 6 | Text, Email, Password, Number, Date, Disabled |
| Card | 4 | Default, With Content, Multiple Cards, Minimal |
| Alert | 6 | Default, Destructive, Icon, Success, Info, All |
| Badge | 6 | Variants, Status Badges, All Variations |
| Dialog | 3 | Modal, Confirm, Form |
| Label | 3 | Default, With Form, Multiple |

### Build Storybook for Production

```bash
npm run build:storybook
```

Output: `storybook-static/` directory

### Documentation Files

- **STORYBOOK_QUICK_START.md** - Quick setup guide
- **STORYBOOK.md** - Comprehensive documentation

For more details, see the consolidated docs in the repo root:

- Storybook quick start & troubleshooting: [../STORYBOOK.md](../STORYBOOK.md)
- Design system overview: [../DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md)

## 📁 Structure

```
design-system/
├── src/
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Page layouts
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── contexts/         # React contexts
│   └── index.ts          # Main entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🎯 Micro Frontend Architecture

This library is designed to support a micro frontend architecture:

1. **Shared Components**: Reusable across all apps
2. **Consistent UX**: Same look and feel everywhere
3. **Independent Development**: Apps can be developed separately
4. **Centralized Updates**: Update once, benefit everywhere

## 🔐 Authentication Flow

The library includes a complete JWT authentication system:

1. **Access Token**: Stored in localStorage
2. **Refresh Token**: Stored in HttpOnly cookies (backend)
3. **Auto Refresh**: Axios interceptor handles token refresh automatically
4. **Global State**: AuthContext manages authentication state

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible components
- **CVA**: Class Variance Authority for component variants
- **Tailwind Merge**: Intelligent class merging

## 🤝 Contributing

This is a private library for Dataxis applications. Contact the development team for contribution guidelines.

## 📄 License

PRIVATE - Dataxis Labs © 2026
