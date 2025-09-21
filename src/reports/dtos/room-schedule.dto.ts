import { ApiProperty } from '@nestjs/swagger';
import { ScheduleIntervalDto } from './schedule-interval.dto';

export class RoomScheduleDto {
  @ApiProperty({ example: 1 })
  roomId: number;

  @ApiProperty({ example: 'Sala 101' })
  roomName: string;

  @ApiProperty({ example: 'Bloco A', required: false })
  buildingName?: string | null;

  @ApiProperty({ type: [ScheduleIntervalDto] })
  occupied: ScheduleIntervalDto[];

  @ApiProperty({ type: [ScheduleIntervalDto] })
  free: ScheduleIntervalDto[];
}
