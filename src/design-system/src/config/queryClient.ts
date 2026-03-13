import { QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

// Create a query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - how long data is considered fresh (5 minutes)
      staleTime: 5 * 60 * 1000,

      // Cache time - how long unused data stays in cache (10 minutes)
      gcTime: 10 * 60 * 1000,

      // Retry failed requests
      retry: (failureCount, error) => {
        // Don't retry on 401, 403, 404
        if (error instanceof AxiosError) {
          const status = error.response?.status
          if (status === 401 || status === 403 || status === 404) {
            return false
          }
        }
        return failureCount < 2
      },

      // Refetch on window focus
      refetchOnWindowFocus: false,

      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations on failure
      retry: false,
    },
  },
})

// Global error handler for queries
export const handleQueryError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || error.message
    console.error('Query failed:', message)
    return message
  }
  return 'An unexpected error occurred'
}
