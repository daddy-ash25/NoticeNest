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

/**
 * Utility: generate date range
 */
function generateDates(daysBefore = 10, daysAfter = 20): Date[] {
    const today = new Date();
    const dates: Date[] = [];

    for (let i = -daysBefore; i <= daysAfter; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push(d);
    }

    return dates;
}

export default function NoticeTimeline() {
    const todayStr = formatDate(new Date());

    const dates = useMemo(() => generateDates(6,8), []);

    return (
        <div className="px-4 py-6 space-y-12">

            {dates.map((date, index) => {
                const dateStr = formatDate(date);
                const isToday = dateStr === todayStr;

                const isNewMonth =
                    index === 0 ||
                    date.getMonth() !== dates[index - 1].getMonth();

                return (
                    <div key={dateStr}>

                        {/* Month separation */}
                        {isNewMonth && (
                            <div className="my-6 text-sm text-muted-foreground">
                                {date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </div>
                        )}

                        {/* Today separator */}
                        {isToday && (
                            <div className="my-6 border-t-2 border-red-500"></div>
                        )}

                        {/* Cards grid */}
                        <div className="grid grid-cols-3 lg:grid-cols-7 gap-6">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div
                                    key={i}
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
        </div>
    );
}
