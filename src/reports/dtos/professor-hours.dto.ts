import { ApiProperty } from '@nestjs/swagger';

export class ProfessorHoursDto {
  @ApiProperty({ example: 1 })
  professorId: number;

  @ApiProperty({ example: 'Girafales' })
  name: string;

  @ApiProperty({ example: 4.5, description: 'Total hours committed' })
  hours: number;
}
