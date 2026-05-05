import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealTemplate } from './meal-template.entity';
import { UserMeal } from './user-meal.entity';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MealTemplate, UserMeal])],
  providers: [MealsService],
  controllers: [MealsController],
  exports: [MealsService],
})
export class MealsModule {}
