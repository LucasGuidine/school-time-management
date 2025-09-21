export type ProfessorHours = {
  professorId: number;
  name: string;
  hours: number;
};
export type RoomScheduleItem = {
  roomId: number;
  roomName: string;
  buildingName?: string | null;
  dayOfWeek: number | null;
  startTime?: string | null;
  endTime?: string | null;
};

export interface IReportsRepository {
  getProfessorHours(): Promise<ProfessorHours[]>;
  getRoomsSchedulesForDay(dayOfWeek: number): Promise<RoomScheduleItem[]>;
}
