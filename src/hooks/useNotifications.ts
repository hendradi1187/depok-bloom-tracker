import { useState, useEffect, useCallback } from 'react'
import { Notification } from '@/types/api'

// Mock notifications - In production, this would come from backend API
const generateMockNotifications = (): Notification[] => {
  const now = new Date()
  const mockData: Notification[] = [
    {
      id: '1',
      type: 'scan',
      title: 'Scan Baru',
      message: 'Petugas Lapangan memindai Mawar Merah di Taman Kota Depok',
      link: '/officer/scans',
      read: false,
      created_at: new Date(now.getTime() - 5 * 60000).toISOString(), // 5 min ago
      metadata: {
        plant_name: 'Mawar Merah',
        location: 'Taman Kota Depok',
        user_name: 'Petugas Lapangan',
      },
    },
    {
      id: '2',
      type: 'plant_created',
      title: 'Tanaman Baru Ditambahkan',
      message: 'Monstera Deliciosa telah ditambahkan ke katalog',
      link: '/admin',
      read: false,
      created_at: new Date(now.getTime() - 15 * 60000).toISOString(), // 15 min ago
      metadata: {
        plant_name: 'Monstera Deliciosa',
      },
    },
    {
      id: '3',
      type: 'scan',
      title: 'Scan Baru',
      message: 'Petugas Lapangan memindai Anggrek Bulan di Sawangan',
      link: '/officer/scans',
      read: false,
      created_at: new Date(now.getTime() - 30 * 60000).toISOString(), // 30 min ago
      metadata: {
        plant_name: 'Anggrek Bulan',
        location: 'Sawangan',
        user_name: 'Petugas Lapangan',
      },
    },
    {
      id: '4',
      type: 'plant_updated',
      title: 'Tanaman Diperbarui',
      message: 'Informasi Lidah Mertua telah diperbarui',
      link: '/admin',
      read: true,
      created_at: new Date(now.getTime() - 60 * 60000).toISOString(), // 1 hour ago
      metadata: {
        plant_name: 'Lidah Mertua',
      },
    },
    {
      id: '5',
      type: 'user_created',
      title: 'Pengguna Baru',
      message: 'Petugas Baru telah didaftarkan ke sistem',
      link: '/admin/users',
      read: true,
      created_at: new Date(now.getTime() - 120 * 60000).toISOString(), // 2 hours ago
      metadata: {
        user_name: 'Petugas Baru',
      },
    },
  ]
  return mockData
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('notifications')
    if (stored) {
      try {
        setNotifications(JSON.parse(stored))
      } catch {
        setNotifications(generateMockNotifications())
      }
    } else {
      setNotifications(generateMockNotifications())
    }
    setIsLoading(false)
  }, [])

  // Save to localStorage whenever notifications change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('notifications', JSON.stringify(notifications))
    }
  }, [notifications, isLoading])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'created_at'>) => {
    const newNotif: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      created_at: new Date().toISOString(),
    }
    setNotifications((prev) => [newNotif, ...prev])
  }, [])

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    addNotification,
    clearNotification,
    clearAll,
  }
}
