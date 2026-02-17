import type { Notice } from "@/types/notice";
import { mockNotices } from "@/data/mockNotices";

/**
 * Fetch notices for a given date range
 * Phase-1: Uses mock data
 * Phase-2: Will fetch from backend
 */
export async function getNoticesForRange(
  startDate: string,
  endDate: string
): Promise<Notice[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = mockNotices.filter(
        (notice) => notice.date >= startDate && notice.date <= endDate
      );
      resolve(filtered);
    }, 300);
  });
}

/**
 * Create a new notice
 * Phase-1: Pushes into mockNotices
 * Phase-2: POST to backend
 */
export async function createNotice(
  input: Omit<Notice, "id" | "createdAt" | "updatedAt">
): Promise<Notice> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date().toISOString();

      const newNotice: Notice = {
        ...input,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };

      mockNotices.push(newNotice);
      resolve(newNotice);
    }, 300);
  });
}
