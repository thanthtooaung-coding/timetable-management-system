"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function Home() {
  const [showSignIn, setShowSignIn] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/timetable")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (user) {
    return null
  }

  if (showSignIn) {
    return <SignInPage onBack={() => setShowSignIn(false)} />
  }

  if (showRegister) {
    return <RegisterPage onBack={() => setShowRegister(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-60"></div>
        <div className="absolute top-20 right-20 w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-blue-300 opacity-70"></div>
        <div className="absolute bottom-20 left-20 w-12 h-8 bg-yellow-200 opacity-60"></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-pink-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-10 right-1/4 w-0 h-0 border-l-10 border-r-10 border-b-16 border-l-transparent border-r-transparent border-b-blue-300 opacity-60"></div>
        <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-yellow-300 rotate-45 opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/3 w-14 h-14 bg-pink-300 rounded-full opacity-40"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold text-gray-800 font-serif">School Timetable</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => setShowSignIn(true)}
            variant="outline"
            className="border-pink-300 text-pink-600 hover:bg-pink-50 px-6 py-2 rounded-xl"
          >
            Sign In
          </Button>
          <Button
            onClick={() => setShowRegister(true)}
            className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-2 rounded-xl shadow-lg"
          >
            Register
          </Button>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 font-serif">Manage Your School Schedule</h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
            Create, customize, and organize your school timetable with ease. Add subjects, manage time slots, and keep
            track of your daily schedule.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Dynamic Scheduling</h3>
              <p className="text-gray-600">Create custom days and time slots that fit your school's unique schedule.</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Color Coding</h3>
              <p className="text-gray-600">
                Assign custom colors to different activity types for easy visual organization.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Management</h3>
              <p className="text-gray-600">
                Quickly add, edit, or remove subjects and activities with our intuitive interface.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowRegister(true)}
            className="bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl shadow-lg text-lg font-medium"
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  )
}

function SignInPage({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { signIn, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await signIn(email, password)

    if (success) {
      router.push("/timetable")
    } else {
      setError("Invalid email or password. Password must be at least 6 characters.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-60"></div>
        <div className="absolute top-20 right-20 w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-blue-300 opacity-70"></div>
        <div className="absolute bottom-20 left-20 w-12 h-8 bg-yellow-200 opacity-60"></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-pink-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-10 right-1/4 w-0 h-0 border-l-10 border-r-10 border-b-16 border-l-transparent border-r-transparent border-b-blue-300 opacity-60"></div>
        <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-yellow-300 rotate-45 opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/3 w-14 h-14 bg-pink-300 rounded-full opacity-40"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Button onClick={onBack} variant="ghost" className="mb-6 text-gray-600 hover:text-gray-800">
            ← Back to Home
          </Button>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6 font-serif">Sign In</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-pink-400 hover:bg-pink-500 text-white py-3 rounded-xl shadow-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  onBack()
                }}
                className="text-pink-600 hover:text-pink-700 font-medium"
                disabled={isLoading}
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function RegisterPage({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false)
  const { signUp, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords don't match!")
      return
    }

    const success = await signUp(name, email, password)

    if (success) {
      setShowConfirmationMessage(true)
    } else {
      setError("Registration failed. Please check your information and try again.")
    }
  }

  if (showConfirmationMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 font-serif">Check your email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a confirmation link to <strong>{email}</strong>. Please click the link to complete your registration.
          </p>
          <Button onClick={onBack} variant="ghost" className="text-gray-600 hover:text-gray-800">
            ← Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-60"></div>
        <div className="absolute top-20 right-20 w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-blue-300 opacity-70"></div>
        <div className="absolute bottom-20 left-20 w-12 h-8 bg-yellow-200 opacity-60"></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-pink-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-10 right-1/4 w-0 h-0 border-l-10 border-r-10 border-b-16 border-l-transparent border-r-transparent border-b-blue-300 opacity-60"></div>
        <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-yellow-300 rotate-45 opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/3 w-14 h-14 bg-pink-300 rounded-full opacity-40"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Button onClick={onBack} variant="ghost" className="mb-6 text-gray-600 hover:text-gray-800">
            ← Back to Home
          </Button>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6 font-serif">Register</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-pink-400 hover:bg-pink-500 text-white py-3 rounded-xl shadow-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => {
                  onBack()
                }}
                className="text-pink-600 hover:text-pink-700 font-medium"
                disabled={isLoading}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
