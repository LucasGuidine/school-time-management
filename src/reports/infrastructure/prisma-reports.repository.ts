import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IReportsRepository,
  ProfessorHours,
  RoomScheduleItem,
} from '../domain/interfaces/reports-repository.interface';

@Injectable()
export class PrismaReportsRepository implements IReportsRepository {
  constructor(private prisma: PrismaService) {}

  async getProfessorHours(): Promise<ProfessorHours[]> {
    const raw = await this.prisma.$queryRaw<
      Array<{ professor_id: number; name: string; hours: number }>
    >`
      SELECT 
        p.id AS professor_id, 
        p.name,
        SUM(
          EXTRACT(EPOCH FROM (
            MAKE_TIME(
              CAST(SPLIT_PART(cs."endTime", ':', 1) AS INTEGER),
              CAST(SPLIT_PART(cs."endTime", ':', 2) AS INTEGER),
              CAST(SPLIT_PART(cs."endTime", ':', 3) AS NUMERIC)
            ) - 
            MAKE_TIME(
              CAST(SPLIT_PART(cs."startTime", ':', 1) AS INTEGER),
              CAST(SPLIT_PART(cs."startTime", ':', 2) AS INTEGER),
              CAST(SPLIT_PART(cs."startTime", ':', 3) AS NUMERIC)
            )
          )) / 3600.0
        ) AS hours
      FROM "Professor" p
      JOIN "Subject" s ON s."professorId" = p.id
      JOIN "Class" c ON c."subjectId" = s.id
      JOIN "ClassSchedule" cs ON cs."classId" = c.id
      GROUP BY p.id, p.name
      ORDER BY p.name;
    `;

    return raw.map((r) => ({
      professorId: r.professor_id,
      name: r.name,
      hours: Number(r.hours || 0),
    }));
  }

  async getRoomsSchedulesForDay(
    dayOfWeek: number,
  ): Promise<RoomScheduleItem[]> {
    const raw = await this.prisma.$queryRaw<
      Array<{
        room_id: number;
        room_name: string;
        building_name: string | null;
        day_of_week: number | null;
        start_time: string | null;
        end_time: string | null;
      }>
    >`
      SELECT 
        r.id AS room_id, 
        r.name AS room_name, 
        b.name AS building_name,
        cs."dayOfWeek" AS day_of_week, 
        cs."startTime" AS start_time, 
        cs."endTime" AS end_time
      FROM "Room" r
      LEFT JOIN "ClassSchedule" cs ON cs."roomId" = r.id AND cs."dayOfWeek" = ${dayOfWeek}
      LEFT JOIN "Building" b ON r."buildingId" = b.id
      ORDER BY r.id, cs."startTime";
    `;

    return raw.map((r) => ({
      roomId: r.room_id,
      roomName: r.room_name,
      buildingName: r.building_name,
      dayOfWeek: r.day_of_week,
      startTime: r.start_time,
      endTime: r.end_time,
    }));
  }
}
