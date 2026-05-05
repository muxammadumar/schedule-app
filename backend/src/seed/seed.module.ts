import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutTemplate } from '../workouts/workout-template.entity';
import { MealTemplate } from '../meals/meal-template.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutTemplate, MealTemplate])],
  providers: [SeedService],
})
export class SeedModule {}
