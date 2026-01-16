// src/data/mockNotices.ts

import type { Notice } from "@/types/notice";

export const mockNotices: Notice[] = [
  {
    id: "1",
    title: "Mid Semester Exam",
    category: "exam",
    date: "2026-01-18",
    importance: true,
    scope: "class",
    description: "Syllabus: Units 3–5",
    source: "class",
    createdBy: "Class Admin",
    color: "#ff6b6b",
  },
  {
    id: "2",
    title: "Republic Day",
    category: "holiday",
    date: "2026-01-26",
    importance: false,
    scope: "class",
    source: "system",
    createdBy: "System",
    color: "#ffd93d",
  },
  {
    id: "3",
    title: "Group Project Meeting",
    category: "meeting",
    date: "2026-01-18",
    importance: false,
    scope: "personal",
    time: "4:00 PM",
    description: "Discuss UI skeleton & data flow",
    source: "user",
    createdBy: "You",
    color: "#6bcfff",
  },
];
