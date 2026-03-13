// Application constants

// Use import.meta.env for Vite/browser, fallback to process.env for Jest
const getAPIBaseURL = () => {
  // Use eval to avoid TypeScript compilation of import.meta
  // This allows the code to work in both Vite (browser) and Jest (Node)
  try {
    // eslint-disable-next-line no-eval
    const viteEnv = eval(
      'typeof import !== "undefined" && import.meta && import.meta.env',
    )
    if (viteEnv && viteEnv.VITE_API_BASE_URL) {
      return viteEnv.VITE_API_BASE_URL
    }
  } catch (e) {
    // Fall through to process.env check
  }
  // Fallback for Jest/Node environment
  return (
    (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) ||
    'http://localhost:3000/api'
  )
}

export const API_BASE_URL = getAPIBaseURL()

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  HOME: '/',
} as const

export const AUTH = {
  TOKEN_KEY: 'token',
  USER_KEY: 'username',
  AUTH_KEY: 'isAuthenticated',
} as const

// Add more constants as needed
