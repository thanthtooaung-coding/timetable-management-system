"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TimetableGrid } from "@/components/timetable-grid"
import { ManageTimetableModal } from "@/components/manage-timetable-modal"
import { ManageActivityTypesModal } from "@/components/manage-activity-types-modal"
import { ManageDaysModal } from "@/components/manage-days-modal"
import { ManageTimeSlotsModal } from "@/components/manage-time-slots-modal"
import { useAuth } from "@/contexts/auth-context"

export type TimetableEntry = {
  day: string
  period: number
  type: string
  subject?: string
}

export type ActivityType = {
  id: string
  name: string
  color: string
  needsSubject: boolean
}

export type Day = {
  id: string
  name: string
  displayName: string
}

export type TimeSlot = {
  id: string
  period: number
  displayName: string
}

const defaultActivityTypes: ActivityType[] = [
  { id: "lecture", name: "Lecture", color: "#fecaca", needsSubject: true }, // red-200
  { id: "tutorial", name: "Tutorial", color: "#fed7aa", needsSubject: true }, // orange-200
  { id: "lunch", name: "Lunch Time", color: "#fde68a", needsSubject: false }, // yellow-200
  { id: "free", name: "Free Period", color: "#d1fae5", needsSubject: false }, // green-200
]

const defaultDays: Day[] = [
  { id: "monday", name: "MONDAY", displayName: "Monday" },
  { id: "tuesday", name: "TUESDAY", displayName: "Tuesday" },
  { id: "wednesday", name: "WEDNESDAY", displayName: "Wednesday" },
  { id: "thursday", name: "THURSDAY", displayName: "Thursday" },
  { id: "friday", name: "FRIDAY", displayName: "Friday" },
]

const defaultTimeSlots: TimeSlot[] = [
  { id: "period1", period: 1, displayName: "Period 1" },
  { id: "period2", period: 2, displayName: "Period 2" },
  { id: "period3", period: 3, displayName: "Period 3" },
  { id: "period4", period: 4, displayName: "Period 4" },
  { id: "period5", period: 5, displayName: "Period 5" },
  { id: "period6", period: 6, displayName: "Period 6" },
]

const initialTimetable: TimetableEntry[] = [
  { day: "MONDAY", period: 1, type: "Lecture", subject: "MANAGEMENT" },
  { day: "MONDAY", period: 2, type: "Lecture", subject: "Ethics" },
  { day: "MONDAY", period: 3, type: "Lecture", subject: "MATH" },
  { day: "MONDAY", period: 4, type: "Lecture", subject: "Ethics" },
  { day: "MONDAY", period: 5, type: "Lecture", subject: "NETWORK" },
  { day: "TUESDAY", period: 1, type: "Lecture", subject: "NETWORK" },
  { day: "TUESDAY", period: 2, type: "Free Period", subject: "" },
  { day: "TUESDAY", period: 3, type: "Lecture", subject: "CO" },
  { day: "TUESDAY", period: 4, type: "Lecture", subject: "MATH" },
  { day: "TUESDAY", period: 5, type: "Lecture", subject: "Management" },
  { day: "TUESDAY", period: 6, type: "Lecture", subject: "JAVA" },
  { day: "WEDNESDAY", period: 1, type: "Lecture", subject: "NETWORK" },
  { day: "WEDNESDAY", period: 2, type: "Lecture", subject: "MATH" },
  { day: "WEDNESDAY", period: 3, type: "Free Period", subject: "" },
  { day: "WEDNESDAY", period: 4, type: "Lecture", subject: "Management" },
  { day: "WEDNESDAY", period: 5, type: "Lecture", subject: "CO" },
  { day: "WEDNESDAY", period: 6, type: "Lecture", subject: "JAVA" },
  { day: "THURSDAY", period: 1, type: "Lecture", subject: "Management" },
  { day: "THURSDAY", period: 2, type: "Lecture", subject: "JAVA" },
  { day: "THURSDAY", period: 3, type: "Lecture", subject: "CO" },
  { day: "THURSDAY", period: 4, type: "Lecture", subject: "Ethics" },
  { day: "THURSDAY", period: 5, type: "Lecture", subject: "CO" },
  { day: "THURSDAY", period: 6, type: "Free Period", subject: "" },
  { day: "FRIDAY", period: 1, type: "Lecture", subject: "MATH" },
  { day: "FRIDAY", period: 2, type: "Lecture", subject: "JAVA" },
  { day: "FRIDAY", period: 3, type: "Lecture", subject: "Ethics" },
  { day: "FRIDAY", period: 4, type: "Lecture", subject: "Network" },
  { day: "FRIDAY", period: 5, type: "Free Period", subject: "" },
  { day: "FRIDAY", period: 6, type: "Free Period", subject: "" },
]

export default function TimetablePage() {
  const { user, isLoading, signOut } = useAuth()
  const router = useRouter()

  const [timetable, setTimetable] = useState<TimetableEntry[]>(initialTimetable)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>(defaultActivityTypes)
  const [isActivityTypesModalOpen, setIsActivityTypesModalOpen] = useState(false)
  const [days, setDays] = useState<Day[]>(defaultDays)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(defaultTimeSlots)
  const [isDaysModalOpen, setIsDaysModalOpen] = useState(false)
  const [isTimeSlotsModalOpen, setIsTimeSlotsModalOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = () => {
    signOut()
    router.push("/")
  }

  const handleUpdateTimetable = (updatedEntry: TimetableEntry) => {
    setTimetable((prev) => {
      const existingIndex = prev.findIndex(
        (entry) => entry.day === updatedEntry.day && entry.period === updatedEntry.period,
      )

      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = updatedEntry
        return updated
      } else {
        return [...prev, updatedEntry]
      }
    })
  }

  const handleAddActivityType = (activityType: ActivityType) => {
    setActivityTypes((prev) => [...prev, activityType])
  }

  const handleUpdateActivityType = (updatedType: ActivityType) => {
    setActivityTypes((prev) => prev.map((type) => (type.id === updatedType.id ? updatedType : type)))
  }

  const handleDeleteActivityType = (id: string) => {
    setActivityTypes((prev) => prev.filter((type) => type.id !== id))
    setTimetable((prev) =>
      prev.map((entry) =>
        entry.type === activityTypes.find((type) => type.id === id)?.name
          ? { ...entry, type: "Free Period", subject: "" }
          : entry,
      ),
    )
  }

  const handleAddDay = (day: Day) => {
    setDays((prev) => [...prev, day])
  }

  const handleUpdateDay = (updatedDay: Day) => {
    const oldDay = days.find((d) => d.id === updatedDay.id)
    setDays((prev) => prev.map((day) => (day.id === updatedDay.id ? updatedDay : day)))

    if (oldDay && oldDay.name !== updatedDay.name) {
      setTimetable((prev) =>
        prev.map((entry) => (entry.day === oldDay.name ? { ...entry, day: updatedDay.name } : entry)),
      )
    }
  }

  const handleDeleteDay = (id: string) => {
    const dayToDelete = days.find((d) => d.id === id)
    setDays((prev) => prev.filter((day) => day.id !== id))

    if (dayToDelete) {
      setTimetable((prev) => prev.filter((entry) => entry.day !== dayToDelete.name))
    }
  }

  const handleAddTimeSlot = (timeSlot: TimeSlot) => {
    setTimeSlots((prev) => [...prev, timeSlot])
  }

  const handleUpdateTimeSlot = (updatedTimeSlot: TimeSlot) => {
    const oldTimeSlot = timeSlots.find((ts) => ts.id === updatedTimeSlot.id)
    setTimeSlots((prev) => prev.map((slot) => (slot.id === updatedTimeSlot.id ? updatedTimeSlot : slot)))

    if (oldTimeSlot && oldTimeSlot.period !== updatedTimeSlot.period) {
      setTimetable((prev) =>
        prev.map((entry) =>
          entry.period === oldTimeSlot.period ? { ...entry, period: updatedTimeSlot.period } : entry,
        ),
      )
    }
  }

  const handleDeleteTimeSlot = (id: string) => {
    const timeSlotToDelete = timeSlots.find((ts) => ts.id === id)
    setTimeSlots((prev) => prev.filter((slot) => slot.id !== id))

    if (timeSlotToDelete) {
      setTimetable((prev) => prev.filter((entry) => entry.period !== timeSlotToDelete.period))
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 font-serif">School Timetable</h1>
            <p className="text-lg text-gray-600 mt-2">Welcome back, {user.name}!</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 px-6 py-2 rounded-xl bg-transparent"
          >
            Logout
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center max-w-4xl mx-auto">
            <Button
              onClick={() => setIsManageModalOpen(true)}
              className="bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium"
            >
              Manage Timetable
            </Button>
            <Button
              onClick={() => setIsActivityTypesModalOpen(true)}
              className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium"
            >
              Manage Activity Types
            </Button>
            <Button
              onClick={() => setIsDaysModalOpen(true)}
              className="bg-green-400 hover:bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium"
            >
              Manage Days
            </Button>
            <Button
              onClick={() => setIsTimeSlotsModalOpen(true)}
              className="bg-purple-400 hover:bg-purple-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium"
            >
              Manage Time Slots
            </Button>
          </div>
        </div>

        <TimetableGrid timetable={timetable} activityTypes={activityTypes} days={days} timeSlots={timeSlots} />

        <ManageTimetableModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          onUpdate={handleUpdateTimetable}
          currentTimetable={timetable}
          activityTypes={activityTypes}
          days={days}
          timeSlots={timeSlots}
        />

        <ManageActivityTypesModal
          isOpen={isActivityTypesModalOpen}
          onClose={() => setIsActivityTypesModalOpen(false)}
          activityTypes={activityTypes}
          onAdd={handleAddActivityType}
          onUpdate={handleUpdateActivityType}
          onDelete={handleDeleteActivityType}
        />

        <ManageDaysModal
          isOpen={isDaysModalOpen}
          onClose={() => setIsDaysModalOpen(false)}
          days={days}
          onAdd={handleAddDay}
          onUpdate={handleUpdateDay}
          onDelete={handleDeleteDay}
        />

        <ManageTimeSlotsModal
          isOpen={isTimeSlotsModalOpen}
          onClose={() => setIsTimeSlotsModalOpen(false)}
          timeSlots={timeSlots}
          onAdd={handleAddTimeSlot}
          onUpdate={handleUpdateTimeSlot}
          onDelete={handleDeleteTimeSlot}
        />
      </div>
    </div>
  )
}
