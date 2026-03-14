// Token management utility functions
// NOTE: Refresh token is stored in HttpOnly cookies by the backend
// and is NOT accessible via JavaScript for security reasons

const ACCESS_TOKEN_KEY = 'access_token'
const USER_DATA_KEY = 'user_data'

export const tokenManager = {
  /**
   * Get access token from localStorage
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  /**
   * Get refresh token - Returns null as it's stored in HttpOnly cookie
   * The browser automatically sends it with requests to the backend
   * @deprecated This function exists for backward compatibility only
   */
  getRefreshToken: (): string | null => {
    // Refresh token is in HttpOnly cookie, not accessible via JavaScript
    return null
  },

  /**
   * Set access token in localStorage
   */
  setAccessToken: (token: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
    // Dispatch custom event to notify AuthContext
    window.dispatchEvent(new Event('authChange'))
  },

  /**
   * Set refresh token - No-op as it's handled by HttpOnly cookie
   * @deprecated Backend sets this via Set-Cookie header
   * @param _token - Unused parameter (kept for backward compatibility)
   */
  setRefreshToken: (_token: string): void => {
    // Refresh token is set by backend via HttpOnly cookie
    // This function exists for backward compatibility only
    console.warn(
      'setRefreshToken called - refresh token should be set via HttpOnly cookie by backend',
    )
  },

  /**
   * Set access token (refresh token is set by backend via cookie)
   */
  setTokens: (accessToken: string): void => {
    tokenManager.setAccessToken(accessToken)
    // Refresh token is automatically set by backend via Set-Cookie header
  },

  /**
   * Clear all tokens
   * Note: HttpOnly cookie must be cleared by backend logout endpoint
   */
  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
    localStorage.removeItem('username')
    localStorage.removeItem('isAuthenticated')
    // Dispatch custom event to notify AuthContext
    window.dispatchEvent(new Event('authChange'))
    // Note: Backend must clear the HttpOnly refresh_token cookie
  },

  /**
   * Get user data from localStorage
   */
  getUserData: () => {
    const userData = localStorage.getItem(USER_DATA_KEY)
    return userData ? JSON.parse(userData) : null
  },

  /**
   * Set user data in localStorage
   */
  setUserData: (user: {
    id: string
    username: string
    email: string
    role: string
  }): void => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
    // Dispatch custom event to notify AuthContext
    window.dispatchEvent(new Event('authChange'))
  },

  /**
   * Check if user is authenticated (has valid access token)
   * Refresh token is in HttpOnly cookie and checked by backend
   */
  isAuthenticated: (): boolean => {
    return !!tokenManager.getAccessToken()
  },
}
