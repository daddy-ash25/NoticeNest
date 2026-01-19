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
 * Utility: generate dates from today till end of current month
 */
function generateDatesOfThisMonth(): Date[] {
    const today = new Date();
    const dates: Date[] = [];

    const year = today.getFullYear();
    const month = today.getMonth();

    // last day of current month
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= lastDayOfMonth; day++) {
        const d = new Date(year, month, day);
        dates.push(d);
    }

    return dates;
}


function groupDatesIntoWeeks(dates: Date[], todayStr: string) {
    const weeks: {
        days: Date[];
        isCurrentWeek: boolean;
    }[] = [];

    let currentWeek: Date[] = [];
    let containsToday = false;

    dates.forEach((date) => {
        currentWeek.push(date);

        if (formatDate(date) === todayStr) {
            containsToday = true;
        }

        if (date.getDay() === 0) { // Sunday
            weeks.push({
                days: currentWeek,
                isCurrentWeek: containsToday,
            });

            currentWeek = [];
            containsToday = false;
        }
    });

    if (currentWeek.length > 0) {
        weeks.push({
            days: currentWeek,
            isCurrentWeek: containsToday,
        });
    }

    return weeks;
}









function CardMaker(date: Date) {
    return (
        <div
            key={formatDate(date)}
            className="bg-white rounded-lg shadow-sm aspect-[1/1.6] p-4 flex flex-col"
        >
            <div className="text-sm font-medium">
                {date.getDate()} — {getWeekday(date)}
            </div>

            <div className="flex-1 mt-4 bg-gray-100 rounded-md" />
        </div>
    );
}



export default function NoticeTimeline() {
    const todayStr = formatDate(new Date());

    const dates = useMemo(() => generateDatesOfThisMonth(), []);
    const weeks = useMemo(() => groupDatesIntoWeeks(dates, todayStr), [dates, todayStr]);

    return (
        <div className="px-4 py-6 space-y-8">

            {/* Month header */}
            <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                })}
            </div>

            {/* Weeks */}
            {weeks.map((week, index) => (
                <div key={index} className="space-y-4">

                    {/* Red separator before current week */}
                    {week.isCurrentWeek && (
                        <div className="border-t-2 border-red-500" />
                    )}

                    {/* Week grid */}
                    <div className="grid grid-cols-3 lg:grid-cols-7 gap-6">
                        {week.days.map((date) => CardMaker(date))}
                    </div>

                </div>
            ))}

            {/* Infinite scroll placeholder */}
            <div className="w-full h-[5vh] bg-blue-300 rounded-md" />
        </div>
    );
}

