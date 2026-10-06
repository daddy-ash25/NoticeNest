import {
    useMemo,
    useState,
    useRef,
    useEffect,
    useLayoutEffect,
    forwardRef,
    useImperativeHandle,
} from "react";

import { getNoticesForRange } from "@/services/noticeService";
import type { Notice } from "@/types/notice";

type MonthKey = {
    year: number;
    month: number; // 0–11
};

function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

function getWeekday(date: Date): string {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
    });
}

function generateDatesForMonth(
    year: number,
    month: number
): Date[] {
    const dates: Date[] = [];
    const lastDay = new Date(
        year,
        month + 1,
        0
    ).getDate();

    for (let day = 1; day <= lastDay; day++) {
        dates.push(new Date(year, month, day));
    }

    return dates;
}

function groupDatesIntoWeeks(
    dates: Date[],
    todayStr: string
) {
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

        if (date.getDay() === 0) {
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

/* =========================================================
   MONTH VIEW
========================================================= */

function MonthView({
    year,
    month,
    todayStr,
    todayRef,
}: MonthKey & {
    todayStr: string;
    todayRef: React.RefObject<HTMLDivElement | null>;
}) {
    const dates = generateDatesForMonth(year, month);

    const weeks = groupDatesIntoWeeks(
        dates,
        todayStr
    );

    const [notices, setNotices] =
        useState<Notice[]>([]);

    useEffect(() => {
        let cancelled = false;

        const loadNotices = async () => {
            try {
                const startDate = formatDate(
                    new Date(year, month, 1)
                );

                const endDate = formatDate(
                    new Date(year, month + 1, 0)
                );

                const result =
                    await getNoticesForRange(
                        startDate,
                        endDate
                    );

                if (!cancelled) {
                    setNotices(result);
                }
            } catch (error) {
                console.error(
                    `Failed to load notices for ${year}-${month + 1}:`,
                    error
                );

                if (!cancelled) {
                    setNotices([]);
                }
            }
        };

        loadNotices();

        return () => {
            cancelled = true;
        };
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
        <section className="space-y-8">
            {/* Month heading */}
            <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-green-300/95 backdrop-blur-sm">
                <div className="text-sm font-semibold text-muted-foreground">
                    {new Date(
                        year,
                        month
                    ).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                    })}
                </div>
            </div>

            {weeks.map((week, i) => (
                <div
                    key={i}
                    className="space-y-4"
                >
                    {/* TODAY LINE */}
                    {week.isCurrentWeek && (
                        <div
                            ref={todayRef}
                            className="border-t-2 border-red-500"
                        />
                    )}

                    <div className="grid grid-cols-3 lg:grid-cols-7 gap-6">
                        {week.days.map((date) => (
                            <CardMaker
                                key={formatDate(date)}
                                date={date}
                                notices={
                                    noticesByDate[
                                        formatDate(date)
                                    ] || []
                                }
                            />
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}

/* =========================================================
   DAY CARD
========================================================= */

function CardMaker({
    date,
    notices,
}: {
    date: Date;
    notices: Notice[];
}) {
    const primaryNotice = notices[0];

    return (
        <div className="bg-white rounded-lg shadow-sm aspect-[1/1.6] overflow-hidden flex flex-col">

            {/* TOP */}
            <div className="h-[40%] p-3 bg-gray-50 flex flex-col justify-between">

                <div className="flex justify-between text-xs font-medium text-gray-600">
                    <span>
                        {date.getDate()}
                    </span>

                    <span>
                        {getWeekday(date)}
                    </span>
                </div>

                {primaryNotice && (
                    <div className="text-sm font-semibold mt-2 line-clamp-2">
                        {primaryNotice.title}
                    </div>
                )}
            </div>

            {/* BOTTOM */}
            <div className="flex-1 p-3 flex flex-col gap-2">

                {primaryNotice?.time && (
                    <div className="text-xs text-gray-500">
                        ⏰ {primaryNotice.time}
                    </div>
                )}

                {primaryNotice?.description && (
                    <div className="text-sm text-gray-700 line-clamp-4">
                        {primaryNotice.description}
                    </div>
                )}
            </div>
        </div>
    );
}

/* =========================================================
   MONTH HELPERS
========================================================= */

function getPreviousMonth(
    month: MonthKey
): MonthKey {
    return month.month === 0
        ? {
              year: month.year - 1,
              month: 11,
          }
        : {
              year: month.year,
              month: month.month - 1,
          };
}

function getNextMonth(
    month: MonthKey
): MonthKey {
    return month.month === 11
        ? {
              year: month.year + 1,
              month: 0,
          }
        : {
              year: month.year,
              month: month.month + 1,
          };
}

function sameMonth(
    a: MonthKey,
    b: MonthKey
): boolean {
    return (
        a.year === b.year &&
        a.month === b.month
    );
}

/* =========================================================
   PUBLIC REF
========================================================= */

export interface NoticeTimelineHandle {
    scrollToToday: () => void;
}

/* =========================================================
   NOTICE TIMELINE
========================================================= */

const NoticeTimeline = forwardRef<
    NoticeTimelineHandle
>((_, ref) => {

    const today = new Date();

    const todayStr = formatDate(today);

    const initialMonth: MonthKey = {
        year: today.getFullYear(),
        month: today.getMonth(),
    };

    const [months, setMonths] =
        useState<MonthKey[]>([
            initialMonth,
        ]);

    const scrollRef =
        useRef<HTMLDivElement | null>(null);

    const todayRef =
        useRef<HTMLDivElement | null>(null);

    const isLoadingTop =
        useRef(false);

    const isLoadingBottom =
        useRef(false);

    const pendingPrepend =
        useRef<number | null>(null);

    /* =====================================================
       GO TO TODAY
    ===================================================== */

    useImperativeHandle(
        ref,
        () => ({
            scrollToToday: () => {
                const container =
                    scrollRef.current;

                const todayElement =
                    todayRef.current;

                if (
                    !container ||
                    !todayElement
                ) {
                    return;
                }

                const containerRect =
                    container.getBoundingClientRect();

                const todayRect =
                    todayElement.getBoundingClientRect();

                const offset =
                    todayRect.top -
                    containerRect.top -
                    container.clientHeight / 2 +
                    todayElement.clientHeight / 2;

                container.scrollBy({
                    top: offset,
                    behavior: "smooth",
                });
            },
        }),
        []
    );

    /* =====================================================
       LOAD PREVIOUS MONTH
    ===================================================== */

    const addPreviousMonth = () => {
        if (isLoadingTop.current) {
            return;
        }

        isLoadingTop.current = true;

        const container =
            scrollRef.current;

        if (container) {
            pendingPrepend.current =
                container.scrollHeight;
        }

        setMonths((current) => {
            const first = current[0];

            const previous =
                getPreviousMonth(first);

            if (
                current.some((month) =>
                    sameMonth(
                        month,
                        previous
                    )
                )
            ) {
                pendingPrepend.current =
                    null;

                isLoadingTop.current =
                    false;

                return current;
            }

            return [
                previous,
                ...current,
            ];
        });
    };

    /* =====================================================
       LOAD NEXT MONTH
    ===================================================== */

    const addNextMonth = () => {
        if (isLoadingBottom.current) {
            return;
        }

        isLoadingBottom.current = true;

        setMonths((current) => {
            const last =
                current[current.length - 1];

            const next =
                getNextMonth(last);

            if (
                current.some((month) =>
                    sameMonth(
                        month,
                        next
                    )
                )
            ) {
                isLoadingBottom.current =
                    false;

                return current;
            }

            return [
                ...current,
                next,
            ];
        });
    };

    /* =====================================================
       PRESERVE POSITION AFTER PREPENDING
    ===================================================== */

    useLayoutEffect(() => {
        const container =
            scrollRef.current;

        const oldScrollHeight =
            pendingPrepend.current;

        if (
            !container ||
            oldScrollHeight === null
        ) {
            return;
        }

        const newScrollHeight =
            container.scrollHeight;

        const heightAdded =
            newScrollHeight -
            oldScrollHeight;

        container.scrollTop +=
            heightAdded;

        pendingPrepend.current =
            null;

        isLoadingTop.current =
            false;
    }, [months]);

    /* =====================================================
       INFINITE SCROLL
    ===================================================== */

    useEffect(() => {
        const container =
            scrollRef.current;

        if (!container) {
            return;
        }

        const handleScroll = () => {
            const distanceFromTop =
                container.scrollTop;

            const distanceFromBottom =
                container.scrollHeight -
                container.scrollTop -
                container.clientHeight;

            if (
                distanceFromTop < 700
            ) {
                addPreviousMonth();
            }

            if (
                distanceFromBottom < 700
            ) {
                addNextMonth();
            }
        };

        container.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true,
            }
        );

        handleScroll();

        return () => {
            container.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, []);

    /* =====================================================
       RESET BOTTOM LOADING LOCK
    ===================================================== */

    useEffect(() => {
        isLoadingBottom.current =
            false;
    }, [months.length]);

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div
            ref={scrollRef}
            className="h-full min-h-0 overflow-y-auto overscroll-contain"
        >
            <div className="px-4 py-6 space-y-10">

                {months.map((month) => (
                    <MonthView
                        key={`${month.year}-${month.month}`}
                        year={month.year}
                        month={month.month}
                        todayStr={todayStr}
                        todayRef={todayRef}
                    />
                ))}

            </div>
        </div>
    );
});

NoticeTimeline.displayName =
    "NoticeTimeline";

export default NoticeTimeline;