import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { tokenManager } from '../utils/tokenManager'

// Get base URL from environment or use default
// In production, this will use environment variables set by the build tool
const getBaseURL = () => {
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

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // IMPORTANT: Enable sending cookies with requests
})

// Flag to prevent multiple refresh token requests
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get access token from tokenManager
    const token = tokenManager.getAccessToken()

    // If token exists and it's not a refresh request, add it to headers
    if (token && config.headers && !config.url?.includes('/auth/refresh')) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log request for debugging (remove in production)
    console.log('📤 Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
    })

    return config
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  },
)

// Response interceptor with refresh token logic
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response for debugging (remove in production)
    console.log('📥 Response:', {
      status: response.status,
      data: response.data,
    })

    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Handle different error scenarios
    if (error.response) {
      const status = error.response.status
      const message =
        (error.response.data as { message?: string })?.message || error.message

      console.error('❌ Response Error:', {
        status,
        message,
        data: error.response.data,
      })

      // Handle 401 Unauthorized with refresh token logic
      if (status === 401 && !originalRequest._retry) {
        if (originalRequest.url?.includes('/auth/refresh')) {
          // Refresh token failed, logout user
          console.warn('🔒 Refresh token expired - Logging out...')
          tokenManager.clearTokens()
          window.location.href = '/login'
          return Promise.reject(error)
        }

        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              return axiosInstance(originalRequest)
            })
            .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          // Call refresh endpoint - backend reads refresh token from HttpOnly cookie
          // No need to send refresh token in request body
          const response = await axiosInstance.post('/auth/refresh')
          const { accessToken } = response.data

          // Update only access token (refresh token is updated by backend via Set-Cookie)
          tokenManager.setAccessToken(accessToken)

          // Update original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }

          // Process queued requests
          processQueue(null, accessToken)

          // Retry original request
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          // Refresh failed, logout user
          processQueue(refreshError as Error, null)
          tokenManager.clearTokens()
          window.location.href = '/login'
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      // Handle other status codes
      switch (status) {
        case 403:
          console.error('🚫 Forbidden - You do not have permission')
          break
        case 404:
          console.error('🔍 Resource not found')
          break
        case 500:
          console.error('💥 Server error')
          break
        default:
          console.error(`Error ${status}:`, message)
      }
    } else if (error.request) {
      console.error('📡 Network Error - No response received:', error.request)
    } else {
      console.error('⚠️ Error:', error.message)
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
