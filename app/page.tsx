"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TimetableGrid } from "@/components/timetable-grid"
import { ManageTimetableModal } from "@/components/manage-timetable-modal"
import { ManageActivityTypesModal } from "@/components/manage-activity-types-modal"

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

const defaultActivityTypes: ActivityType[] = [
  { id: "lecture", name: "Lecture", color: "#fecaca", needsSubject: true }, // red-200
  { id: "tutorial", name: "Tutorial", color: "#fed7aa", needsSubject: true }, // orange-200
  { id: "lunch", name: "Lunch Time", color: "#fde68a", needsSubject: false }, // yellow-200
  { id: "free", name: "Free Period", color: "#d1fae5", needsSubject: false }, // green-200
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

export default function Home() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>(initialTimetable)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>(defaultActivityTypes)
  const [isActivityTypesModalOpen, setIsActivityTypesModalOpen] = useState(false)

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
    // Remove this activity type from timetable entries
    setTimetable((prev) =>
      prev.map((entry) =>
        entry.type === activityTypes.find((type) => type.id === id)?.name
          ? { ...entry, type: "Free Period", subject: "" }
          : entry,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
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
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 font-serif">School Timetable</h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          </div>
        </div>

        <TimetableGrid timetable={timetable} activityTypes={activityTypes} />

        <ManageTimetableModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          onUpdate={handleUpdateTimetable}
          currentTimetable={timetable}
          activityTypes={activityTypes}
        />

        <ManageActivityTypesModal
          isOpen={isActivityTypesModalOpen}
          onClose={() => setIsActivityTypesModalOpen(false)}
          activityTypes={activityTypes}
          onAdd={handleAddActivityType}
          onUpdate={handleUpdateActivityType}
          onDelete={handleDeleteActivityType}
        />
      </div>
    </div>
  )
}
