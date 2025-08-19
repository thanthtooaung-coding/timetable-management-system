"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Edit, Plus } from "lucide-react"
import { Day } from "@/app/timetable/page"

interface ManageDaysModalProps {
  isOpen: boolean
  onClose: () => void
  days: Day[]
  onAdd: (day: Day) => void
  onUpdate: (day: Day) => void
  onDelete: (id: string) => void
}

export function ManageDaysModal({ isOpen, onClose, days, onAdd, onUpdate, onDelete }: ManageDaysModalProps) {
  const [newDayName, setNewDayName] = useState("")
  const [newDayDisplayName, setNewDayDisplayName] = useState("")
  const [editingDay, setEditingDay] = useState<Day | null>(null)
  const [editName, setEditName] = useState("")
  const [editDisplayName, setEditDisplayName] = useState("")

  const handleAddDay = () => {
    if (newDayName.trim() && newDayDisplayName.trim()) {
      const newDay: Day = {
        id: newDayName.toLowerCase().replace(/\s+/g, "-"),
        name: newDayName.toUpperCase(),
        display_name: newDayDisplayName,
      }
      onAdd(newDay)
      setNewDayName("")
      setNewDayDisplayName("")
    }
  }

  const handleEditDay = (day: Day) => {
    setEditingDay(day)
    setEditName(day.name)
    setEditDisplayName(day.display_name)
  }

  const handleUpdateDay = () => {
    if (editingDay && editName.trim() && editDisplayName.trim()) {
      const updatedDay: Day = {
        ...editingDay,
        name: editName.toUpperCase(),
        display_name: editDisplayName,
      }
      onUpdate(updatedDay)
      setEditingDay(null)
      setEditName("")
      setEditDisplayName("")
    }
  }

  const handleCancelEdit = () => {
    setEditingDay(null)
    setEditName("")
    setEditDisplayName("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 text-center">Manage Days</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* Add New Day */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Add New Day</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newDayName" className="text-sm font-medium text-gray-700">
                  Day Name (Internal)
                </Label>
                <Input
                  id="newDayName"
                  value={newDayName}
                  onChange={(e) => setNewDayName(e.target.value)}
                  placeholder="e.g., SATURDAY"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="newDayDisplayName" className="text-sm font-medium text-gray-700">
                  Display Name
                </Label>
                <Input
                  id="newDayDisplayName"
                  value={newDayDisplayName}
                  onChange={(e) => setNewDayDisplayName(e.target.value)}
                  placeholder="e.g., Saturday"
                  className="mt-1"
                />
              </div>
            </div>
            <Button
              onClick={handleAddDay}
              className="mt-3 bg-green-500 hover:bg-green-600 text-white"
              disabled={!newDayName.trim() || !newDayDisplayName.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Day
            </Button>
          </div>

          {/* Existing Days */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Existing Days</h3>
            <div className="space-y-3">
              {days.map((day) => (
                <div key={day.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {editingDay?.id === day.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Day Name (Internal)</Label>
                          <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1" />
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
                      <div className="flex gap-2">
                        <Button
                          onClick={handleUpdateDay}
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white"
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
                        <div className="font-medium text-gray-800">{day.display_name}</div>
                        <div className="text-sm text-gray-600">Internal: {day.name}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditDay(day)}
                          size="sm"
                          variant="outline"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => onDelete(day.id)}
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
