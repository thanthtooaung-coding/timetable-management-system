"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Edit, Plus } from "lucide-react"
import type { ActivityType } from "@/app/page"

interface ManageActivityTypesModalProps {
  isOpen: boolean
  onClose: () => void
  activityTypes: ActivityType[]
  onAdd: (activityType: ActivityType) => void
  onUpdate: (activityType: ActivityType) => void
  onDelete: (id: string) => void
}

export function ManageActivityTypesModal({
  isOpen,
  onClose,
  activityTypes,
  onAdd,
  onUpdate,
  onDelete,
}: ManageActivityTypesModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    color: "#fecaca",
    needsSubject: false,
  })

  const handleStartAdd = () => {
    setIsEditing(true)
    setEditingId(null)
    setFormData({
      name: "",
      color: "#fecaca",
      needsSubject: false,
    })
  }

  const handleStartEdit = (activityType: ActivityType) => {
    setIsEditing(true)
    setEditingId(activityType.id)
    setFormData({
      name: activityType.name,
      color: activityType.color,
      needsSubject: activityType.needsSubject,
    })
  }

  const handleSave = () => {
    if (!formData.name.trim()) return

    if (editingId) {
      // Update existing
      onUpdate({
        id: editingId,
        name: formData.name.trim(),
        color: formData.color,
        needsSubject: formData.needsSubject,
      })
    } else {
      // Add new
      onAdd({
        id: Date.now().toString(),
        name: formData.name.trim(),
        color: formData.color,
        needsSubject: formData.needsSubject,
      })
    }

    setIsEditing(false)
    setEditingId(null)
    setFormData({
      name: "",
      color: "#fecaca",
      needsSubject: false,
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingId(null)
    setFormData({
      name: "",
      color: "#fecaca",
      needsSubject: false,
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this activity type? It will be removed from all timetable entries.")) {
      onDelete(id)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-pink-50 to-blue-50 border-2 border-gray-300 rounded-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 text-center">Manage Activity Types</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* Add/Edit Form */}
          {isEditing && (
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 space-y-4">
              <h3 className="font-semibold text-gray-800">
                {editingId ? "Edit Activity Type" : "Add New Activity Type"}
              </h3>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Activity Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter activity name"
                  className="bg-white border-2 border-gray-300 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color" className="text-sm font-medium text-gray-700">
                  Color
                </Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                  />
                  <div
                    className="flex-1 h-10 rounded-lg border-2 border-gray-300"
                    style={{ backgroundColor: formData.color }}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needsSubject"
                  checked={formData.needsSubject}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, needsSubject: checked as boolean }))}
                />
                <Label htmlFor="needsSubject" className="text-sm font-medium text-gray-700">
                  Requires subject name
                </Label>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 border-2 border-gray-300 rounded-lg bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!formData.name.trim()}
                  className="flex-1 bg-blue-400 hover:bg-blue-500 text-white rounded-lg"
                >
                  {editingId ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          )}

          {/* Activity Types List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Current Activity Types</h3>
              {!isEditing && (
                <Button
                  onClick={handleStartAdd}
                  size="sm"
                  className="bg-green-400 hover:bg-green-500 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add New
                </Button>
              )}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {activityTypes.map((activityType) => (
                <div
                  key={activityType.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded border-2 border-gray-300"
                      style={{ backgroundColor: activityType.color }}
                    />
                    <div>
                      <span className="font-medium text-gray-800">{activityType.name}</span>
                      {activityType.needsSubject && (
                        <span className="text-xs text-gray-500 ml-2">(requires subject)</span>
                      )}
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleStartEdit(activityType)}
                        size="sm"
                        variant="outline"
                        className="p-2 border-gray-300"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(activityType.id)}
                        size="sm"
                        variant="outline"
                        className="p-2 border-gray-300 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={onClose} className="w-full bg-gray-400 hover:bg-gray-500 text-white rounded-lg">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
