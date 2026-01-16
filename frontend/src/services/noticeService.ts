// src/services/noticeService.ts

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
        (notice) =>
          notice.date >= startDate && notice.date <= endDate
      );

      resolve(filtered);
    }, 300); // simulate network delay
  });
}
