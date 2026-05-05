import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyChecklist } from './daily-checklist.entity';
import { ChecklistService } from './checklist.service';
import { ChecklistController } from './checklist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DailyChecklist])],
  providers: [ChecklistService],
  controllers: [ChecklistController],
  exports: [ChecklistService],
})
export class ChecklistModule {}
