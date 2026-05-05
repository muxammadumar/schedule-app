import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleViewService } from './schedule.service';
import { ScheduleViewController } from './schedule.controller';
import { MealsModule } from '../meals/meals.module';
import { WorkoutsModule } from '../workouts/workouts.module';
import { ChecklistModule } from '../checklist/checklist.module';
import { MealTemplate } from '../meals/meal-template.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MealTemplate]),
    MealsModule,
    WorkoutsModule,
    ChecklistModule,
  ],
  providers: [ScheduleViewService],
  controllers: [ScheduleViewController],
})
export class ScheduleViewModule {}
