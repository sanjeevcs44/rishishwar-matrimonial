// Validation utility functions

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * At least 6 characters
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

/**
 * Validate username
 * At least 3 characters, alphanumeric
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/
  return usernameRegex.test(username)
}

/**
 * Check if a string is empty or only whitespace
 */
export const isEmpty = (value: string): boolean => {
  return value.trim() === ''
}

/**
 * Validate required fields
 */
export const validateRequired = (value: string): boolean => {
  return !isEmpty(value)
}
