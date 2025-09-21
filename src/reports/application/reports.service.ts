import { Injectable, Inject } from '@nestjs/common';
import {
  IReportsRepository,
  ProfessorHours,
} from '../domain/interfaces/reports-repository.interface';

@Injectable()
export class ReportsService {
  private BUSINESS_START = '07:00:00';
  private BUSINESS_END = '22:00:00';

  constructor(@Inject('IReportsRepository') private repo: IReportsRepository) {}

  async getProfessorHours(): Promise<ProfessorHours[]> {
    return this.repo.getProfessorHours();
  }

  async getRoomsScheduleForDay(dayOfWeek: number) {
    const rows = await this.repo.getRoomsSchedulesForDay(dayOfWeek);
    const map = new Map<
      number,
      {
        roomId: number;
        roomName: string;
        buildingName?: string | null;
        occupied: Array<{ start: string; end: string }>;
      }
    >();

    for (const r of rows) {
      if (!map.has(r.roomId)) {
        map.set(r.roomId, {
          roomId: r.roomId,
          roomName: r.roomName,
          buildingName: r.buildingName,
          occupied: [],
        });
      }
      if (r.startTime && r.endTime) {
        map
          .get(r.roomId)!
          .occupied.push({ start: r.startTime, end: r.endTime });
      }
    }

    const compareTime = (time1: string, time2: string): number => {
      return time1.localeCompare(time2);
    };

    const isTimeLessOrEqual = (time1: string, time2: string): boolean => {
      return compareTime(time1, time2) <= 0;
    };

    const isTimeLess = (time1: string, time2: string): boolean => {
      return compareTime(time1, time2) < 0;
    };

    const computeFree = (occupied: Array<{ start: string; end: string }>) => {
      if (!occupied.length)
        return [{ start: this.BUSINESS_START, end: this.BUSINESS_END }];

      const intervals = [...occupied].sort((a, b) =>
        compareTime(a.start, b.start),
      );

      const merged: Array<{ start: string; end: string }> = [];
      for (const it of intervals) {
        if (!merged.length) {
          merged.push(it);
        } else {
          const last = merged[merged.length - 1];
          if (isTimeLessOrEqual(it.start, last.end)) {
            last.end = isTimeLess(last.end, it.end) ? it.end : last.end;
          } else {
          }
        }
      }

      const free: Array<{ start: string; end: string }> = [];

      if (isTimeLess(this.BUSINESS_START, merged[0].start)) {
        free.push({ start: this.BUSINESS_START, end: merged[0].start });
      }

      for (let i = 0; i < merged.length - 1; i++) {
        if (isTimeLess(merged[i].end, merged[i + 1].start)) {
          free.push({ start: merged[i].end, end: merged[i + 1].start });
        }
      }

      if (isTimeLess(merged[merged.length - 1].end, this.BUSINESS_END)) {
        free.push({
          start: merged[merged.length - 1].end,
          end: this.BUSINESS_END,
        });
      }

      return free;
    };

    const result = [] as any[];
    for (const [_, v] of map) {
      const occupied = v.occupied;
      const free = computeFree(occupied);
      result.push({
        roomId: v.roomId,
        roomName: v.roomName,
        buildingName: v.buildingName,
        occupied: occupied.map((it) => ({
          start: it.start,
          end: it.end,
        })),
        free: free.map((it) => ({
          start: it.start,
          end: it.end,
        })),
      });
    }
    return result;
  }
}
