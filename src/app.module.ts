import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { ReportsController } from './reports/controllers/reports.controller';
import { ReportsService } from './reports/application/reports.service';
import { PrismaReportsRepository } from './reports/infrastructure/prisma-reports.repository';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './auth/api-key.guard';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ReportsController],
  providers: [
    PrismaService,
    ReportsService,
    { provide: 'IReportsRepository', useClass: PrismaReportsRepository },
    PrismaReportsRepository,
    { provide: APP_GUARD, useClass: ApiKeyGuard },
  ],
})
export class AppModule {}
