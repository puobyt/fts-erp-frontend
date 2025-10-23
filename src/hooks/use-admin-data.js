import { useState, useEffect } from 'react'

export function useAdminData() {
  const [adminData, setAdminData] = useState(() => {
    try {
      const stored = localStorage.getItem('admin')
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Error parsing admin data from localStorage:', error)
      return null
    }
  })

  useEffect(() => {
    // Function to update admin data
    const updateAdminData = () => {
      try {
        const stored = localStorage.getItem('admin')
        const newAdminData = stored ? JSON.parse(stored) : null
        setAdminData(newAdminData)
      } catch (error) {
        console.error('Error parsing admin data from localStorage:', error)
        setAdminData(null)
      }
    }

    // Listen for storage changes (from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'admin') {
        updateAdminData()
      }
    }

    // Listen for custom events (from same tab)
    const handleAdminDataChange = () => {
      updateAdminData()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('adminDataChanged', handleAdminDataChange)

    // Also check on mount
    updateAdminData()

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('adminDataChanged', handleAdminDataChange)
    }
  }, [])

  // Function to update admin data and notify other components
  const setAdminDataAndNotify = (newAdminData) => {
    try {
      if (newAdminData) {
        localStorage.setItem('admin', JSON.stringify(newAdminData))
      } else {
        localStorage.removeItem('admin')
      }
      setAdminData(newAdminData)
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('adminDataChanged'))
    } catch (error) {
      console.error('Error updating admin data:', error)
    }
  }

  return { adminData, setAdminData: setAdminDataAndNotify }
}
