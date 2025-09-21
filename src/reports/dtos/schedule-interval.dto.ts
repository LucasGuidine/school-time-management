import { ApiProperty } from '@nestjs/swagger';

export class ScheduleIntervalDto {
  @ApiProperty({ example: '08:00:00' })
  start: string;

  @ApiProperty({ example: '10:00:00' })
  end: string;
}
