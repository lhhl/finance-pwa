/**
 * Hook for monitoring and triggering static cache refresh
 * Provides UI feedback when cache is being refreshed
 */

import { useState, useEffect } from 'react'
import { refreshStaticCache } from '../serviceWorkerRegister'

interface CacheRefreshState {
  isRefreshing: boolean
  lastRefreshed: Date | null
  error: string | null
}

/**
 * Hook to manage static cache refresh
 * Returns state and a function to manually trigger refresh
 */
export function useCacheRefresh() {
  const [state, setState] = useState<CacheRefreshState>({
    isRefreshing: false,
    lastRefreshed: null,
    error: null
  })

  // Automatically refresh when coming online
  useEffect(() => {
    const handleOnline = async () => {
      setState(prev => ({ ...prev, isRefreshing: true, error: null }))
      try {
        await refreshStaticCache()
        setState(prev => ({
          ...prev,
          isRefreshing: false,
          lastRefreshed: new Date()
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          isRefreshing: false,
          error: error instanceof Error ? error.message : 'Failed to refresh cache'
        }))
      }
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [])

  // Manual refresh function
  const manualRefresh = async () => {
    setState(prev => ({ ...prev, isRefreshing: true, error: null }))
    try {
      await refreshStaticCache()
      setState(prev => ({
        ...prev,
        isRefreshing: false,
        lastRefreshed: new Date()
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isRefreshing: false,
        error: error instanceof Error ? error.message : 'Failed to refresh cache'
      }))
    }
  }

  return {
    isRefreshing: state.isRefreshing,
    lastRefreshed: state.lastRefreshed,
    error: state.error,
    refresh: manualRefresh
  }
}
