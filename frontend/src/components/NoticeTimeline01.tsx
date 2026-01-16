import { useMemo } from "react";

/**
 * Utility: format date to YYYY-MM-DD
 */
function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

/**
 * Utility: get weekday name
 */
function getWeekday(date: Date): string {
    return date.toLocaleDateString("en-US", { weekday: "long" });
}

function getWeekdayIndex(date: Date): number {
    return date.getDay(); // 0 = Sunday, 6 = Saturday
}


/**
 * Utility: generate dates from today till end of current month
 */
function generateDatesTillMonthEnd(): Date[] {
    const today = new Date();
    const dates: Date[] = [];

    const year = today.getFullYear();
    const month = today.getMonth();

    // last day of current month
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    for (let day = today.getDate(); day <= lastDayOfMonth; day++) {
        const d = new Date(year, month, day);
        dates.push(d);
    }

    return dates;
}

export default function NoticeTimeline01() {
    const todayStr = formatDate(new Date());

    // dates from today till end of month
    const dates = useMemo(() => generateDatesTillMonthEnd(), []);

    return (
        <div className="px-4 py-6 space-y-12">

            {/* Month header */}
            <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                })}
            </div>

            {/* Dates rendering */}
            {dates.map((date) => {
                const dateStr = formatDate(date);
                const isToday = dateStr === todayStr;

                return (
                    <div key={dateStr} className="space-y-6">

                        {/* Today separator */}
                        {isToday && (
                            <div className="border-t-2 border-red-500" />
                        )}

                        {/* Cards grid */}
                        <div className="grid grid-cols-3 lg:grid-cols-7 gap-6">

                            {/* Empty placeholders before today */}
                            {Array.from({ length: getWeekdayIndex(dates[0]) }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}

                            {/* Actual dates */}
                            {dates.map((date) => (
                                <div
                                    key={formatDate(date)}
                                    className="bg-white rounded-lg shadow-sm aspect-[1/1.6] p-4 flex flex-col"
                                >
                                    <div className="text-sm font-medium">
                                        {date.getDate()} — {getWeekday(date)}
                                    </div>

                                    <div className="flex-1 mt-4 bg-gray-100 rounded-md" />
                                </div>
                            ))}
                        </div>


                    </div>
                );
            })}

            {/* Infinite scroll placeholder */}
            <div className="w-full h-[5vh] bg-blue-300 rounded-md" />

        </div>
    );
}
