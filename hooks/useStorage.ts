'use client'

import { useCallback } from 'react'

type StorageType = 'localStorage' | 'sessionStorage' | 'indexedDB'

interface StorageOptions {
  type?: StorageType
  prefix?: string
  expiration?: number // em millisegundos
  serialize?: boolean
}

interface StoredData {
  value: any
  timestamp: number
  expiration?: number
}

/**
 * Hook personalizado para gerenciamento de storage
 * Suporta localStorage, sessionStorage e IndexedDB
 * 
 * @example
 * const { saveData, loadData, removeData, clearAll } = useStorage()
 * 
 * // Salvar dados
 * saveData('user_preferences', { theme: 'dark' })
 * 
 * // Carregar dados
 * const preferences = loadData('user_preferences')
 * 
 * // Com opções
 * const { saveData } = useStorage({ 
 *   type: 'sessionStorage',
 *   prefix: 'app_',
 *   expiration: 24 * 60 * 60 * 1000 // 24 horas
 * })
 */
export const useStorage = (options: StorageOptions = {}) => {
  const {
    type = 'localStorage',
    prefix = '',
    expiration,
    serialize = true
  } = options

  const getStorage = useCallback(() => {
    if (typeof window === 'undefined') return null
    
    switch (type) {
      case 'localStorage':
        return window.localStorage
      case 'sessionStorage':
        return window.sessionStorage
      default:
        return window.localStorage
    }
  }, [type])

  const getKey = useCallback((key: string) => {
    return prefix ? `${prefix}${key}` : key
  }, [prefix])

  const saveData = useCallback((key: string, value: any, customExpiration?: number) => {
    try {
      const storage = getStorage()
      if (!storage) return false

      const storageKey = getKey(key)
      const exp = customExpiration || expiration
      
      const dataToStore: StoredData = {
        value: serialize ? value : value,
        timestamp: Date.now(),
        ...(exp && { expiration: exp })
      }

      const serializedData = serialize ? JSON.stringify(dataToStore) : dataToStore

      if (type === 'indexedDB') {
        return saveToIndexedDB(storageKey, serializedData)
      }

      storage.setItem(storageKey, typeof serializedData === 'string' ? serializedData : JSON.stringify(serializedData))
      
      console.log(`💾 Dados salvos: ${storageKey}`, value)
      return true

    } catch (error) {
      console.error('Erro ao salvar dados:', error)
      return false
    }
  }, [getStorage, getKey, expiration, serialize, type])

  const loadData = useCallback((key: string, defaultValue?: any) => {
    try {
      const storage = getStorage()
      if (!storage) return defaultValue

      const storageKey = getKey(key)

      if (type === 'indexedDB') {
        return loadFromIndexedDB(storageKey, defaultValue)
      }

      const storedData = storage.getItem(storageKey)
      if (!storedData) return defaultValue

      if (!serialize) return storedData

      const parsedData: StoredData = JSON.parse(storedData)

      // Verificar expiração
      if (parsedData.expiration) {
        const now = Date.now()
        const expirationTime = parsedData.timestamp + parsedData.expiration
        
        if (now > expirationTime) {
          console.log(`⏰ Dados expirados removidos: ${storageKey}`)
          storage.removeItem(storageKey)
          return defaultValue
        }
      }

      console.log(`📂 Dados carregados: ${storageKey}`, parsedData.value)
      return parsedData.value

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      return defaultValue
    }
  }, [getStorage, getKey, serialize, type])

  const removeData = useCallback((key: string) => {
    try {
      const storage = getStorage()
      if (!storage) return false

      const storageKey = getKey(key)

      if (type === 'indexedDB') {
        return removeFromIndexedDB(storageKey)
      }

      storage.removeItem(storageKey)
      console.log(`🗑️ Dados removidos: ${storageKey}`)
      return true

    } catch (error) {
      console.error('Erro ao remover dados:', error)
      return false
    }
  }, [getStorage, getKey, type])

  const clearAll = useCallback(() => {
    try {
      const storage = getStorage()
      if (!storage) return false

      if (type === 'indexedDB') {
        return clearIndexedDB()
      }

      // Se tem prefix, remove apenas as chaves com o prefix
      if (prefix) {
        const keysToRemove: string[] = []
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i)
          if (key && key.startsWith(prefix)) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => storage.removeItem(key))
      } else {
        storage.clear()
      }

      console.log(`🧹 Storage limpo (${type})`)
      return true

    } catch (error) {
      console.error('Erro ao limpar storage:', error)
      return false
    }
  }, [getStorage, prefix, type])

  const getStorageInfo = useCallback(() => {
    try {
      const storage = getStorage()
      if (!storage) return null

      const info = {
        type,
        prefix,
        itemCount: storage.length,
        items: [] as string[]
      }

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (key && (!prefix || key.startsWith(prefix))) {
          info.items.push(key)
        }
      }

      return info

    } catch (error) {
      console.error('Erro ao obter info do storage:', error)
      return null
    }
  }, [getStorage, type, prefix])

  return {
    saveData,
    loadData,
    removeData,
    clearAll,
    getStorageInfo
  }
}

// Funções auxiliares para IndexedDB
async function saveToIndexedDB(key: string, data: any): Promise<boolean> {
  try {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AppStorage', 1)
      
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains('data')) {
          db.createObjectStore('data')
        }
      }
      
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['data'], 'readwrite')
        const store = transaction.objectStore('data')
        
        store.put(data, key)
        
        transaction.oncomplete = () => resolve(true)
        transaction.onerror = () => reject(transaction.error)
      }
      
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Erro IndexedDB save:', error)
    return false
  }
}

async function loadFromIndexedDB(key: string, defaultValue?: any): Promise<any> {
  try {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AppStorage', 1)
      
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['data'], 'readonly')
        const store = transaction.objectStore('data')
        
        const getRequest = store.get(key)
        
        getRequest.onsuccess = () => {
          resolve(getRequest.result ?? defaultValue)
        }
        
        getRequest.onerror = () => reject(getRequest.error)
      }
      
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Erro IndexedDB load:', error)
    return defaultValue
  }
}

async function removeFromIndexedDB(key: string): Promise<boolean> {
  try {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AppStorage', 1)
      
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['data'], 'readwrite')
        const store = transaction.objectStore('data')
        
        store.delete(key)
        
        transaction.oncomplete = () => resolve(true)
        transaction.onerror = () => reject(transaction.error)
      }
      
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Erro IndexedDB remove:', error)
    return false
  }
}

async function clearIndexedDB(): Promise<boolean> {
  try {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AppStorage', 1)
      
      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['data'], 'readwrite')
        const store = transaction.objectStore('data')
        
        store.clear()
        
        transaction.oncomplete = () => resolve(true)
        transaction.onerror = () => reject(transaction.error)
      }
      
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Erro IndexedDB clear:', error)
    return false
  }
}
