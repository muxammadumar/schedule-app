import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutTemplate } from './workout-template.entity';
import { UserWorkout } from './user-workout.entity';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutTemplate, UserWorkout])],
  providers: [WorkoutsService],
  controllers: [WorkoutsController],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}
