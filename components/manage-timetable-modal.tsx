"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TimetableEntry, ActivityType, Day, TimeSlot } from "@/app/timetable/page"

interface ManageTimetableModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (entry: TimetableEntry) => void
  currentTimetable: TimetableEntry[]
  activityTypes: ActivityType[]
  days: Day[]
  timeSlots: TimeSlot[]
}

export function ManageTimetableModal({
  isOpen,
  onClose,
  onUpdate,
  currentTimetable,
  activityTypes,
  days,
  timeSlots,
}: ManageTimetableModalProps) {
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<string>("")
  const [subjectName, setSubjectName] = useState("")

  /**
   * Effect to initialize and synchronize the modal's state.
   * It runs when the modal is opened or when the selected day/period changes.
   */
  useEffect(() => {
    if (isOpen) {
      // Initialize with the first available day and time slot if they are not set.
      const initialDay = days[0]?.name || ""
      const initialPeriod = timeSlots[0]?.period || null
      
      const currentDay = selectedDay || initialDay;
      const currentPeriod = selectedPeriod !== null ? selectedPeriod : initialPeriod;

      if(selectedDay === "") setSelectedDay(currentDay);
      if(selectedPeriod === null) setSelectedPeriod(currentPeriod);

      if (currentDay && currentPeriod !== null) {
        const entry = currentTimetable.find(
          (e) => e.day === currentDay && e.period === currentPeriod
        );
        if (entry) {
          setSelectedType(entry.type);
          setSubjectName(entry.subject || "");
        } else {
          // Reset to default if no entry is found for the selection.
          setSelectedType("Free Period");
          setSubjectName("");
        }
      }
    }
  }, [isOpen, selectedDay, selectedPeriod, currentTimetable, days, timeSlots]);

  /**
   * Updates the selected day state. The useEffect will handle the rest.
   * @param day - The name of the selected day.
   */
  const handleDayChange = (day: string) => {
    setSelectedDay(day);
  };

  /**
   * Updates the selected period state. The useEffect will handle the rest.
   * @param period - The string representation of the selected period number.
   */
  const handlePeriodChange = (period: string) => {
    const periodNum = Number.parseInt(period);
    setSelectedPeriod(periodNum);
  };

  /**
   * Gathers the current form state and calls the onUpdate callback.
   */
  const handleSave = () => {
    if (!selectedDay || selectedPeriod === null) return;

    const updatedEntry: TimetableEntry = {
      day: selectedDay,
      period: selectedPeriod,
      type: selectedType,
      subject: getSelectedActivityType()?.needs_subject ? subjectName : "",
    };

    onUpdate(updatedEntry);
    onClose();
  };

  const getSelectedActivityType = () => {
    return activityTypes.find((type) => type.name === selectedType);
  };

  const needsSubject = getSelectedActivityType()?.needs_subject || false;

  const sortedTimeSlots = [...timeSlots].sort((a, b) => a.period - b.period);

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
                  <SelectItem key={day.id} value={day.name}>
                    {day.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period" className="text-sm font-medium text-gray-700">
              Time Slot
            </Label>
            <Select value={selectedPeriod?.toString() || ""} onValueChange={handlePeriodChange}>
              <SelectTrigger className="bg-white border-2 border-gray-300 rounded-lg">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {sortedTimeSlots.map((timeSlot) => (
                  <SelectItem key={timeSlot.id} value={timeSlot.period.toString()}>
                    {timeSlot.display_name}
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
