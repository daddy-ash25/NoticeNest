


import { useMemo, useState, useRef, useEffect } from "react";




type MonthKey = {
    year: number;
    month: number; // 0–11
};


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

function generateDatesForMonth(year: number, month: number): Date[] {
    const dates: Date[] = [];
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= lastDay; day++) {
        dates.push(new Date(year, month, day));
    }

    return dates;
}


function MonthView({ year, month, todayStr }: MonthKey & { todayStr: string }) {
    const dates = generateDatesForMonth(year, month);
    const weeks = groupDatesIntoWeeks(dates, todayStr);

    return (
        <div className="space-y-8">
            <div className="text-sm text-muted-foreground">
                {new Date(year, month).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                })}
            </div>

            {weeks.map((week, i) => (
                <div key={i} className="space-y-4">
                    {week.isCurrentWeek && (
                        <div className="border-t-2 border-red-500" />
                    )}

                    <div className="grid grid-cols-3 lg:grid-cols-7 gap-6">
                        {week.days.map(CardMaker)}
                    </div>
                </div>
            ))}
        </div>
    );
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

/*setMonths(prev => {
  const last = prev[prev.length - 1];
  const nextMonth = last.month === 11
    ? { year: last.year + 1, month: 0 }
    : { year: last.year, month: last.month + 1 };

  return [...prev, nextMonth];
});


setMonths(prev => {
  const first = prev[0];
  const prevMonth = first.month === 0
    ? { year: first.year - 1, month: 11 }
    : { year: first.year, month: first.month - 1 };

  return [prevMonth, ...prev];
});*/




export default function NoticeTimeline() {
    const todayStr = formatDate(new Date());

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const [months, setMonths] = useState<MonthKey[]>([
        { year: currentYear, month: currentMonth }
    ]);

    const topSentinel = useRef<HTMLDivElement | null>(null);
    const bottomSentinel = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                // 🔽 BOTTOM: load next month
                if (entry.target === bottomSentinel.current) {
                    setMonths(prev => {
                        const last = prev[prev.length - 1];

                        const nextMonth =
                            last.month === 11
                                ? { year: last.year + 1, month: 0 }
                                : { year: last.year, month: last.month + 1 };

                        const exists = prev.some(
                            m => m.year === nextMonth.year && m.month === nextMonth.month
                        );

                        if (exists) return prev;
                        return [...prev, nextMonth];
                    });
                }

                // 🔼 TOP: load previous month
                if (entry.target === topSentinel.current) {
                    setMonths(prev => {
                        const first = prev[0];

                        const prevMonth =
                            first.month === 0
                                ? { year: first.year - 1, month: 11 }
                                : { year: first.year, month: first.month - 1 };

                        const exists = prev.some(
                            m => m.year === prevMonth.year && m.month === prevMonth.month
                        );

                        if (exists) return prev;
                        return [prevMonth, ...prev];
                    });
                }
            });
        });

        if (topSentinel.current) observer.observe(topSentinel.current);
        if (bottomSentinel.current) observer.observe(bottomSentinel.current);

        return () => observer.disconnect();
    }, []);



    return (
        <div className="px-4 py-6 space-y-8">

            {/* Top sentinel */}
            <div ref={topSentinel} className="h-[5vh]" />

            {/* Months */}
            {months.map(m => (
                <MonthView
                    key={`${m.year}-${m.month}`}
                    year={m.year}
                    month={m.month}
                    todayStr={todayStr}
                />
            ))}

            {/* Bottom sentinel */}
            <div ref={bottomSentinel} className="h-[5vh]" />
        </div>
    );
}

