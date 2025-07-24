'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { apiClient } from '@/lib/api'
import { User, AuthContextType, RegisterData, ApiResponse } from '@/types'
import toast from 'react-hot-toast'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await apiClient.get<ApiResponse<User>>('/api/auth/me')
      if (response.success) {
        setUser(response.data)
      } else {
        Cookies.remove('token')
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      Cookies.remove('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await apiClient.post<ApiResponse<{ token: string; user: User }>>('/api/auth/login', {
        email,
        password,
      })

      if (response.success) {
        const { token, user: userData } = response.data
        Cookies.set('token', token, { expires: 7 }) // 7 days
        setUser(userData)
        toast.success('Login successful!')
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      const response = await apiClient.post<ApiResponse<{ token: string; user: User }>>('/api/auth/register', userData)

      if (response.success) {
        const { token, user: newUser } = response.data
        Cookies.set('token', token, { expires: 7 }) // 7 days
        setUser(newUser)
        toast.success('Registration successful!')
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const logout = (): void => {
    Cookies.remove('token')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
