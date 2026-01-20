


import { useMemo, useState, useRef, useEffect } from "react";
import { getNoticesForRange } from "@/services/noticeService";
import type { Notice } from "@/types/notice";




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

    const [notices, setNotices] = useState<Notice[]>([]);

    useEffect(() => {
        const startDate = formatDate(new Date(year, month, 1));
        const endDate = formatDate(new Date(year, month + 1, 0));

        getNoticesForRange(startDate, endDate).then(setNotices);
    }, [year, month]);

    const noticesByDate = useMemo(() => {
        const map: Record<string, Notice[]> = {};

        notices.forEach((notice) => {
            if (!map[notice.date]) {
                map[notice.date] = [];
            }
            map[notice.date].push(notice);
        });

        return map;
    }, [notices]);


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
                        {week.days.map(date =>
                            CardMaker(date, noticesByDate[formatDate(date)] || [])
                        )}

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









function CardMaker(date: Date, notices: Notice[]) {
  const primaryNotice = notices[0]; // for now: show first notice

  return (
    <div
      key={formatDate(date)}
      className="bg-white rounded-lg shadow-sm aspect-[1/1.6] overflow-hidden flex flex-col"
    >
      {/* 🔹 TOP SECTION (40%) */}
      <div className="h-[40%] p-3 bg-gray-50 flex flex-col justify-between">
        {/* Date & weekday */}
        <div className="flex justify-between text-xs font-medium text-gray-600">
          <span>{date.getDate()}</span>
          <span>{getWeekday(date)}</span>
        </div>

        {/* Notice title */}
        {primaryNotice && (
          <div className="text-sm font-semibold mt-2 line-clamp-2">
            {primaryNotice.title}
          </div>
        )}
      </div>

      {/* 🔹 BOTTOM SECTION (60%) */}
      <div className="flex-1 p-3 flex flex-col gap-2">
        {/* Time */}
        {primaryNotice?.time && (
          <div className="text-xs text-gray-500">
            ⏰ {primaryNotice.time}
          </div>
        )}

        {/* Description */}
        {primaryNotice?.description && (
          <div className="text-sm text-gray-700 line-clamp-4">
            {primaryNotice.description}
          </div>
        )}
      </div>
    </div>
  );
}


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

