import type { TimetableEntry, ActivityType } from "@/app/page"

interface TimetableGridProps {
  timetable: TimetableEntry[]
  activityTypes: ActivityType[] // Added activityTypes prop
}

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
const periods = [1, 2, 3, 4, 5, 6]

export function TimetableGrid({ timetable, activityTypes }: TimetableGridProps) {
  const getEntryForSlot = (day: string, period: number) => {
    return timetable.find((entry) => entry.day === day && entry.period === period)
  }

  const getActivityTypeColor = (typeName: string) => {
    const activityType = activityTypes.find((type) => type.name === typeName)
    return activityType?.color || "#fce7f3" // default pink-100
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {/* Header Row */}
            <div className="bg-blue-200 border-2 border-gray-800 p-3 md:p-4 text-center font-bold text-gray-800 rounded-lg">
              Time
            </div>
            {periods.map((period) => (
              <div
                key={period}
                className="bg-pink-300 border-2 border-gray-800 p-3 md:p-4 text-center font-bold text-gray-800 rounded-lg"
              >
                {period}
              </div>
            ))}

            {/* Timetable Rows */}
            {days.map((day) => (
              <>
                <div
                  key={day}
                  className="bg-blue-200 border-2 border-gray-800 p-3 md:p-4 text-center font-bold text-gray-800 rounded-lg flex items-center justify-center"
                >
                  <span className="text-xs md:text-sm lg:text-base">{day}</span>
                </div>
                {periods.map((period) => {
                  const entry = getEntryForSlot(day, period)
                  return (
                    <div
                      key={`${day}-${period}`}
                      style={{ backgroundColor: entry?.type ? getActivityTypeColor(entry.type) : "#fce7f3" }}
                      className="border-2 border-gray-800 p-2 md:p-3 text-center rounded-lg min-h-[60px] md:min-h-[80px] flex items-center justify-center"
                    >
                      <span className="text-xs md:text-sm font-medium text-gray-800">{entry?.subject || ""}</span>
                    </div>
                  )
                })}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
