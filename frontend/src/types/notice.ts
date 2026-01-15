export interface Notice {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO format
  scope: "personal" | "class" | "subclass";
  importance: "low" | "medium" | "high";
}