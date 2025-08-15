import type { TimetableEntry, ActivityType, Day, TimeSlot } from "@/app/page"

interface TimetableGridProps {
  timetable: TimetableEntry[]
  activityTypes: ActivityType[]
  days: Day[] // Added dynamic days prop
  timeSlots: TimeSlot[] // Added dynamic time slots prop
}

export function TimetableGrid({ timetable, activityTypes, days, timeSlots }: TimetableGridProps) {
  const getEntryForSlot = (day: string, period: number) => {
    return timetable.find((entry) => entry.day === day && entry.period === period)
  }

  const getActivityTypeColor = (typeName: string) => {
    const activityType = activityTypes.find((type) => type.name === typeName)
    return activityType?.color || "#fce7f3" // default pink-100
  }

  const sortedTimeSlots = [...timeSlots].sort((a, b) => a.period - b.period)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div
            className={`grid gap-1 md:gap-2`}
            style={{ gridTemplateColumns: `repeat(${sortedTimeSlots.length + 1}, minmax(0, 1fr))` }}
          >
            {/* Header Row */}
            <div className="bg-blue-200 border-2 border-gray-800 p-3 md:p-4 text-center font-bold text-gray-800 rounded-lg">
              Time
            </div>
            {sortedTimeSlots.map((timeSlot) => (
              <div
                key={timeSlot.id}
                className="bg-pink-300 border-2 border-gray-800 p-3 md:p-4 text-center font-bold text-gray-800 rounded-lg"
              >
                {timeSlot.period}
              </div>
            ))}

            {/* Timetable Rows */}
            {days.map((day) => (
              <>
                <div
                  key={day.id}
                  className="bg-blue-200 border-2 border-gray-800 p-3 md:p-4 text-center font-bold text-gray-800 rounded-lg flex items-center justify-center"
                >
                  <span className="text-xs md:text-sm lg:text-base">{day.name}</span>
                </div>
                {sortedTimeSlots.map((timeSlot) => {
                  const entry = getEntryForSlot(day.name, timeSlot.period)
                  return (
                    <div
                      key={`${day.name}-${timeSlot.period}`}
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
