import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";

import NoticeTimeline, {
  type NoticeTimelineHandle,
} from "@/components/NoticeTimeline";

import { useClassApi } from "@/services/classApi";

interface ClassItem {
  _id: string;
  name: string;
  description?: string;
  membersCanCreateNotices: boolean;
  role: "admin" | "member";
}

const HomeMain: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] =
    useState(false);

  const [classes, setClasses] =
    useState<ClassItem[]>([]);

  const [selectedClasses, setSelectedClasses] =
    useState<string[]>([]);

  const [isLoadingClasses, setIsLoadingClasses] =
    useState(false);

  const noticeTimelineRef =
    useRef<NoticeTimelineHandle>(null);

  const { getUserClasses } =
    useClassApi();

  /* =====================================================
     LOAD CLASSES
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadClasses = async () => {
      try {
        setIsLoadingClasses(true);

        const memberships =
          await getUserClasses();

        if (cancelled) {
          return;
        }

        const loadedClasses: ClassItem[] =
          memberships.map(
            (membership: any) => ({
              _id:
                membership.classId._id,

              name:
                membership.classId.name,

              description:
                membership.classId.description,

              membersCanCreateNotices:
                membership.classId
                  .membersCanCreateNotices,

              role:
                membership.role,
            })
          );

        setClasses(
          loadedClasses
        );

        setSelectedClasses(
          loadedClasses.map(
            (classItem) =>
              classItem._id
          )
        );

      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load user classes:",
            error
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingClasses(false);
        }
      }
    };

    loadClasses();

    return () => {
      cancelled = true;
    };
  }, [getUserClasses]);

  /* =====================================================
     CLASS VISIBILITY
  ===================================================== */

  const toggleClassVisibility = (
    classId: string
  ) => {
    setSelectedClasses(
      (current) =>
        current.includes(classId)
          ? current.filter(
              (id) =>
                id !== classId
            )
          : [
              ...current,
              classId,
            ]
    );
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="flex-1 min-h-0 flex flex-col relative">

      {/* =================================================
          CALENDAR CONTROLS
      ================================================= */}

      <div className="h-[5vh] min-h-[52px] w-full bg-blue-300 flex items-center justify-between px-4 relative z-50 shrink-0">

        <div className="flex items-center gap-3">

          <div className="h-8 w-8 flex items-center justify-center">
            15
          </div>

          <span className="text-lg">
            January
          </span>

          <Button variant="ghost">
            2026
          </Button>

        </div>

        {/* =================================================
            VISIBLE BUTTON
        ================================================= */}

        <div className="relative">

          <Button
            className="rounded-full px-6"
            onClick={() =>
              setIsFilterOpen(
                (prev) => !prev
              )
            }
          >
            Visible
          </Button>

          {/* =================================================
              VISIBLE POPUP
          ================================================= */}

          {isFilterOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[min(360px,calc(100vw-32px))] bg-yellow-200 z-[100] rounded-lg shadow-xl border border-black/10 p-5">

              <div className="text-xl font-semibold mb-4">
                Visible Classes
              </div>

              {isLoadingClasses ? (
                <div>
                  Loading classes...
                </div>
              ) : (
                <div className="flex flex-col gap-3">

                  {/* PERSONAL */}

                  <div className="flex items-center gap-3">

                    <input
                      type="checkbox"
                      checked
                      readOnly
                    />

                    <span>
                      Personal
                    </span>

                    <div className="ml-auto h-5 w-5 rounded-full border-2 border-black bg-white" />

                  </div>

                  {/* CLASSES */}

                  {classes.map(
                    (classItem) => (
                      <div
                        key={
                          classItem._id
                        }
                        className="flex items-center gap-3"
                      >

                        <input
                          type="checkbox"
                          checked={selectedClasses.includes(
                            classItem._id
                          )}
                          onChange={() =>
                            toggleClassVisibility(
                              classItem._id
                            )
                          }
                        />

                        <span className="truncate">
                          {
                            classItem.name
                          }
                        </span>

                        <div className="ml-auto shrink-0 h-5 w-5 rounded-full border-2 border-black bg-white" />

                      </div>
                    )
                  )}

                  {classes.length ===
                    0 && (
                    <div className="text-sm">
                      You are not a member of any class yet.
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* =================================================
          CALENDAR VIEWPORT
      ================================================= */}

      <div className="flex-1 min-h-0 relative overflow-hidden bg-green-300">

        <NoticeTimeline
          ref={noticeTimelineRef}
        />

        {/* =================================================
            GO TO TODAY BUTTON
        ================================================= */}

        <Button
          className="h-12 w-12 rounded-full absolute bottom-6 right-6 z-20 text-2xl"
          onClick={() =>
            noticeTimelineRef.current?.scrollToToday()
          }
          aria-label="Go to today"
        >
          ↑
        </Button>

      </div>

      {/* =================================================
          BOTTOM BAR
      ================================================= */}

      <div className="h-[15vh] min-h-[90px] w-full bg-purple-300 flex items-center px-4 gap-4 shrink-0">

        <div className="flex-1 h-12 bg-white rounded-md" />

        <Button
          className="h-12 w-12 rounded-full text-xl"
          onClick={() =>
            console.log(
              "Create notice button"
            )
          }
        >
          +
        </Button>

      </div>

    </div>
  );
};

export default HomeMain;