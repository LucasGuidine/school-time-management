import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from '../application/reports.service';
import {
  ApiOperation,
  ApiTags,
  ApiSecurity,
  ApiQuery,
  ApiOkResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { ProfessorHoursDto } from '../dtos/professor-hours.dto';
import { RoomScheduleDto } from '../dtos/room-schedule.dto';

@ApiTags('reports')
@ApiSecurity('x-api-key')
@ApiExtraModels(RoomScheduleDto)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('professors-hours')
  @ApiOperation({
    summary: 'Hours committed by teacher (sum of class durations)',
  })
  @ApiOkResponse({
    description: 'List of teachers with hours',
    type: ProfessorHoursDto,
    isArray: true,
  })
  async getProfessorHours() {
    return this.reportsService.getProfessorHours();
  }

  @Get('rooms')
  @ApiOperation({
    summary:
      'List of rooms with busy times and free breaks for a day of the week (0-6)',
  })
  @ApiQuery({
    name: 'dayOfWeek',
    required: true,
    description: '0=Sunday, 1=Monday... 6=Saturday',
  })
  @ApiOkResponse({
    description: 'List of rooms with occupied[] and free[]',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(RoomScheduleDto) },
    },
  })
  async getRooms(@Query('dayOfWeek') dayOfWeek: string) {
    const d = parseInt(dayOfWeek, 10);
    return this.reportsService.getRoomsScheduleForDay(d);
  }
}
