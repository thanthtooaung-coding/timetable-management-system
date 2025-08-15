"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("auth-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("auth-user")
      }
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email && password.length >= 6) {
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email: email,
      }

      setUser(newUser)
      localStorage.setItem("auth-user", JSON.stringify(newUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (name && email && password.length >= 6) {
      const newUser: User = {
        id: Date.now().toString(),
        name: name,
        email: email,
      }

      setUser(newUser)
      localStorage.setItem("auth-user", JSON.stringify(newUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("auth-user")
  }

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
