import { useEffect, useState } from 'react'

/**
 * Hook to detect if the app is online or offline
 * Useful for displaying connection status in the UI
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

/**
 * Hook to access local storage with localStorage API
 * Provides a way to store data that persists across app sessions
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      console.error(`Error reading localStorage key "${key}":`, new Error().message)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {
      console.error(`Error setting localStorage key "${key}":`, new Error().message)
    }
  }

  return [storedValue, setValue] as const
}

/**
 * Hook to access IndexedDB with simplified API
 * Useful for storing larger amounts of data locally
 */
export function useIndexedDB(dbName: string, storeName: string) {
  const [db, setDb] = useState<IDBDatabase | null>(null)

  useEffect(() => {
    const request = indexedDB.open(dbName, 1)

    request.onerror = () => {
      console.error('IndexedDB open error:', request.error)
    }

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true })
      }
    }

    request.onsuccess = () => {
      setDb(request.result)
    }

    return () => {
      if (db) {
        db.close()
      }
    }
  }, [dbName, storeName, db])

  const addItem = async (item: unknown) => {
    if (!db) return null
    const transaction = db.transaction([storeName], 'readwrite')
    const objectStore = transaction.objectStore(storeName)
    const request = objectStore.add(item)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  const getItem = async (key: IDBValidKey) => {
    if (!db) return null
    const transaction = db.transaction([storeName], 'readonly')
    const objectStore = transaction.objectStore(storeName)
    const request = objectStore.get(key)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  const getAllItems = async () => {
    if (!db) return []
    const transaction = db.transaction([storeName], 'readonly')
    const objectStore = transaction.objectStore(storeName)
    const request = objectStore.getAll()

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  const deleteItem = async (key: IDBValidKey) => {
    if (!db) return null
    const transaction = db.transaction([storeName], 'readwrite')
    const objectStore = transaction.objectStore(storeName)
    const request = objectStore.delete(key)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(null)
      request.onerror = () => reject(request.error)
    })
  }

  const updateItem = async (item: unknown) => {
    if (!db) return null
    const transaction = db.transaction([storeName], 'readwrite')
    const objectStore = transaction.objectStore(storeName)
    const request = objectStore.put(item)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  return { addItem, getItem, getAllItems, deleteItem, updateItem }
}

/**
 * Hook for querying IndexedDB data
 * Similar to useLocalStorage but for IndexedDB
 */
export function useIndexedDBData<T>(dbName: string, storeName: string, key: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const request = indexedDB.open(dbName, 1)

    request.onerror = () => {
      setError(new Error('Failed to open IndexedDB'))
      setLoading(false)
    }

    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction([storeName], 'readonly')
      const objectStore = transaction.objectStore(storeName)
      const getRequest = objectStore.get(key)

      getRequest.onsuccess = () => {
        setData(getRequest.result)
        setLoading(false)
      }

      getRequest.onerror = () => {
        setError(new Error('Failed to fetch data from IndexedDB'))
        setLoading(false)
      }
    }
  }, [dbName, storeName, key])

  return { data, loading, error }
}
