"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Edit, Plus } from "lucide-react"
import type { TimeSlot } from "@/app/page"

interface ManageTimeSlotsModalProps {
  isOpen: boolean
  onClose: () => void
  timeSlots: TimeSlot[]
  onAdd: (timeSlot: TimeSlot) => void
  onUpdate: (timeSlot: TimeSlot) => void
  onDelete: (id: string) => void
}

export function ManageTimeSlotsModal({
  isOpen,
  onClose,
  timeSlots,
  onAdd,
  onUpdate,
  onDelete,
}: ManageTimeSlotsModalProps) {
  const [newPeriod, setNewPeriod] = useState("")
  const [newDisplayName, setNewDisplayName] = useState("")
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null)
  const [editPeriod, setEditPeriod] = useState("")
  const [editDisplayName, setEditDisplayName] = useState("")

  const handleAddTimeSlot = () => {
    const periodNum = Number.parseInt(newPeriod)
    if (periodNum && newDisplayName.trim() && !timeSlots.some((ts) => ts.period === periodNum)) {
      const newTimeSlot: TimeSlot = {
        id: `period${periodNum}`,
        period: periodNum,
        displayName: newDisplayName,
      }
      onAdd(newTimeSlot)
      setNewPeriod("")
      setNewDisplayName("")
    }
  }

  const handleEditTimeSlot = (timeSlot: TimeSlot) => {
    setEditingTimeSlot(timeSlot)
    setEditPeriod(timeSlot.period.toString())
    setEditDisplayName(timeSlot.displayName)
  }

  const handleUpdateTimeSlot = () => {
    const periodNum = Number.parseInt(editPeriod)
    if (editingTimeSlot && periodNum && editDisplayName.trim()) {
      // Check if period number conflicts with existing slots (excluding current one)
      const hasConflict = timeSlots.some((ts) => ts.period === periodNum && ts.id !== editingTimeSlot.id)
      if (!hasConflict) {
        const updatedTimeSlot: TimeSlot = {
          ...editingTimeSlot,
          period: periodNum,
          displayName: editDisplayName,
        }
        onUpdate(updatedTimeSlot)
        setEditingTimeSlot(null)
        setEditPeriod("")
        setEditDisplayName("")
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingTimeSlot(null)
    setEditPeriod("")
    setEditDisplayName("")
  }

  const sortedTimeSlots = [...timeSlots].sort((a, b) => a.period - b.period)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 text-center">Manage Time Slots</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* Add New Time Slot */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Add New Time Slot</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPeriod" className="text-sm font-medium text-gray-700">
                  Period Number
                </Label>
                <Input
                  id="newPeriod"
                  type="number"
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value)}
                  placeholder="e.g., 7"
                  className="mt-1"
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="newDisplayName" className="text-sm font-medium text-gray-700">
                  Display Name
                </Label>
                <Input
                  id="newDisplayName"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="e.g., Period 7"
                  className="mt-1"
                />
              </div>
            </div>
            <Button
              onClick={handleAddTimeSlot}
              className="mt-3 bg-purple-500 hover:bg-purple-600 text-white"
              disabled={
                !newPeriod || !newDisplayName.trim() || timeSlots.some((ts) => ts.period === Number.parseInt(newPeriod))
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Time Slot
            </Button>
            {timeSlots.some((ts) => ts.period === Number.parseInt(newPeriod)) && newPeriod && (
              <p className="text-red-600 text-sm mt-2">Period {newPeriod} already exists</p>
            )}
          </div>

          {/* Existing Time Slots */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Existing Time Slots</h3>
            <div className="space-y-3">
              {sortedTimeSlots.map((timeSlot) => (
                <div key={timeSlot.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {editingTimeSlot?.id === timeSlot.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Period Number</Label>
                          <Input
                            type="number"
                            value={editPeriod}
                            onChange={(e) => setEditPeriod(e.target.value)}
                            className="mt-1"
                            min="1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Display Name</Label>
                          <Input
                            value={editDisplayName}
                            onChange={(e) => setEditDisplayName(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      {timeSlots.some((ts) => ts.period === Number.parseInt(editPeriod) && ts.id !== timeSlot.id) &&
                        editPeriod && <p className="text-red-600 text-sm">Period {editPeriod} already exists</p>}
                      <div className="flex gap-2">
                        <Button
                          onClick={handleUpdateTimeSlot}
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          disabled={timeSlots.some(
                            (ts) => ts.period === Number.parseInt(editPeriod) && ts.id !== timeSlot.id,
                          )}
                        >
                          Save
                        </Button>
                        <Button onClick={handleCancelEdit} size="sm" variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">{timeSlot.displayName}</div>
                        <div className="text-sm text-gray-600">Period: {timeSlot.period}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditTimeSlot(timeSlot)}
                          size="sm"
                          variant="outline"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => onDelete(timeSlot.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
