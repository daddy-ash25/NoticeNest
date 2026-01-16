// src/types/notice.ts

export type NoticeCategory =
  | "exam"
  | "class"
  | "assignment"
  | "meeting"
  | "festival"
  | "holiday"
  | "event"
  | "personal"
  | "announcement";

export type NoticeScope =
  | "personal"
  | "class"
  | "subclass";

export type NoticeSource =
  | "user"
  | "class"
  | "system";

export interface Notice {
  id: string;

  title: string;

  category: NoticeCategory;

  date: string; // ISO format: YYYY-MM-DD

  importance: boolean;

  scope: NoticeScope;

  description?: string;

  time?: string; // Optional, e.g. "10:30 AM"

  source: NoticeSource;

  createdBy: string;

  color?: string; // Sticky-note color (future use)
}
