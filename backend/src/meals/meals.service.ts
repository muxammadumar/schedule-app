import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealTemplate } from './meal-template.entity';
import { UserMeal } from './user-meal.entity';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const GYM_DAYS = [1, 3, 5];

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(MealTemplate)
    private readonly mealTemplateRepo: Repository<MealTemplate>,
    @InjectRepository(UserMeal)
    private readonly userMealRepo: Repository<UserMeal>,
  ) {}

  getAllTemplates(): Promise<MealTemplate[]> {
    return this.mealTemplateRepo.find({ order: { dayOfWeek: 'ASC', id: 'ASC' } });
  }

  async getTemplatesByDay(dayOfWeek: string): Promise<MealTemplate[]> {
    const day = parseInt(dayOfWeek);
    const templates = await this.mealTemplateRepo.find();
    return templates.filter((m) => {
      if (m.mealType === 'snack') return GYM_DAYS.includes(day) && m.dayOfWeek === day;
      return m.dayOfWeek === day || m.dayOfWeek === null;
    });
  }

  async getMyPlan(userId: number) {
    const userMeals = await this.userMealRepo.find({
      where: { userId },
      relations: ['mealTemplate'],
    });
    const templates = await this.mealTemplateRepo.find();
    const days = [1, 2, 3, 4, 5, 6, 0];

    return days.map((day) => {
      const isGymDay = GYM_DAYS.includes(day);
      const mealTypesForDay = isGymDay ? MEAL_TYPES : MEAL_TYPES.filter((t) => t !== 'snack');

      const meals = mealTypesForDay.map((type) => {
        const userEntry = userMeals.find((um) => um.dayOfWeek === day && um.mealType === type);
        if (userEntry) return { mealType: type, meal: userEntry.mealTemplate };
        const template =
          templates.find((t) => t.dayOfWeek === day && t.mealType === type) ||
          templates.find((t) => t.dayOfWeek === null && t.mealType === type);
        return { mealType: type, meal: template || null };
      });

      return { dayOfWeek: day, meals };
    });
  }

  async setMyMeal(userId: number, dayOfWeek: number, mealType: string, mealTemplateId: number) {
    let existing = await this.userMealRepo.findOne({ where: { userId, dayOfWeek, mealType } });
    if (existing) {
      existing.mealTemplateId = mealTemplateId;
      return this.userMealRepo.save(existing);
    }
    const entry = this.userMealRepo.create({ userId, dayOfWeek, mealType, mealTemplateId });
    return this.userMealRepo.save(entry);
  }

  getMealsForDay(day: number, templates: MealTemplate[]) {
    const isGymDay = GYM_DAYS.includes(day);
    const mealTypesForDay = isGymDay ? MEAL_TYPES : MEAL_TYPES.filter((t) => t !== 'snack');
    return mealTypesForDay.map((type) => {
      const template =
        templates.find((t) => t.dayOfWeek === day && t.mealType === type) ||
        templates.find((t) => t.dayOfWeek === null && t.mealType === type);
      return { mealType: type, meal: template || null };
    });
  }
}
