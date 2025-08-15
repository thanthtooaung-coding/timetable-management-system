"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TimetableEntry, ActivityType } from "@/app/page"

interface ManageTimetableModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (entry: TimetableEntry) => void
  currentTimetable: TimetableEntry[]
  activityTypes: ActivityType[] // Added activityTypes prop
}

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
const periods = [1, 2, 3, 4, 5, 6]

export function ManageTimetableModal({
  isOpen,
  onClose,
  onUpdate,
  currentTimetable,
  activityTypes,
}: ManageTimetableModalProps) {
  const [selectedDay, setSelectedDay] = useState<string>("MONDAY")
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(1)
  const [selectedType, setSelectedType] = useState<string>("Free Period") // Changed to string
  const [subjectName, setSubjectName] = useState("")

  const getCurrentEntry = () => {
    if (!selectedDay || selectedPeriod === null) return null
    return currentTimetable.find((entry) => entry.day === selectedDay && entry.period === selectedPeriod)
  }

  const handleDayChange = (day: string) => {
    setSelectedDay(day)
    if (selectedPeriod !== null) {
      const entry = currentTimetable.find((e) => e.day === day && e.period === selectedPeriod)
      if (entry) {
        setSelectedType(entry.type)
        setSubjectName(entry.subject || "")
      } else {
        setSelectedType("Free Period")
        setSubjectName("")
      }
    }
  }

  const handlePeriodChange = (period: string) => {
    const periodNum = Number.parseInt(period)
    setSelectedPeriod(periodNum)
    if (selectedDay) {
      const entry = currentTimetable.find((e) => e.day === selectedDay && e.period === periodNum)
      if (entry) {
        setSelectedType(entry.type)
        setSubjectName(entry.subject || "")
      } else {
        setSelectedType("Free Period")
        setSubjectName("")
      }
    }
  }

  const handleSave = () => {
    if (!selectedDay || selectedPeriod === null) return

    const updatedEntry: TimetableEntry = {
      day: selectedDay,
      period: selectedPeriod,
      type: selectedType,
      subject: getSelectedActivityType()?.needsSubject ? subjectName : "",
    }

    onUpdate(updatedEntry)
    onClose()

    // Reset form
    setSelectedDay("MONDAY")
    setSelectedPeriod(1)
    setSelectedType("Free Period")
    setSubjectName("")
  }

  const getSelectedActivityType = () => {
    return activityTypes.find((type) => type.name === selectedType)
  }

  const needsSubject = getSelectedActivityType()?.needsSubject || false

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-pink-50 to-blue-50 border-2 border-gray-300 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 text-center">Manage Timetable</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          <div className="space-y-2">
            <Label htmlFor="day" className="text-sm font-medium text-gray-700">
              Day
            </Label>
            <Select value={selectedDay} onValueChange={handleDayChange}>
              <SelectTrigger className="bg-white border-2 border-gray-300 rounded-lg">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period" className="text-sm font-medium text-gray-700">
              Time Slot
            </Label>
            <Select value={selectedPeriod?.toString() || "1"} onValueChange={handlePeriodChange}>
              <SelectTrigger className="bg-white border-2 border-gray-300 rounded-lg">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period} value={period.toString()}>
                    Period {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
              Activity Type
            </Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-white border-2 border-gray-300 rounded-lg">
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: type.color }} />
                      {type.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {needsSubject && (
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                Subject Name
              </Label>
              <Input
                id="subject"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Enter subject name"
                className="bg-white border-2 border-gray-300 rounded-lg"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-2 border-gray-300 rounded-lg bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedDay || selectedPeriod === null || (needsSubject && !subjectName.trim())}
              className="flex-1 bg-pink-400 hover:bg-pink-500 text-white rounded-lg"
            >
              Save & Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
