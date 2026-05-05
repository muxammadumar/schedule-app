import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealsService } from '../meals/meals.service';
import { WorkoutsService } from '../workouts/workouts.service';
import { ChecklistService } from '../checklist/checklist.service';
import { MealTemplate } from '../meals/meal-template.entity';

const GYM_DAYS = [1, 3, 5];

const GYM_TIMELINE = [
  { time: '6:00', task: 'Wake up' },
  { time: '6:15', task: 'Morning run (5km)' },
  { time: '7:00', task: 'Shower + breakfast' },
  { time: '10:00', task: 'Work starts' },
  { time: '13:00', task: 'Lunch break' },
  { time: '13:30', task: '10-min walk after lunch' },
  { time: '14:00', task: 'Back to work' },
  { time: '17:30', task: 'Pre-gym snack + leave for gym' },
  { time: '18:00', task: 'Gym session' },
  { time: '19:30', task: 'Work ends / return home' },
  { time: '20:00', task: 'Dinner' },
  { time: '22:00', task: 'Wind down' },
  { time: '23:00', task: 'In bed' },
];

const REST_TIMELINE = [
  { time: '7:00', task: 'Wake up' },
  { time: '7:30', task: 'Breakfast' },
  { time: '10:00', task: 'Work starts' },
  { time: '13:00', task: 'Lunch break' },
  { time: '13:30', task: '10-min walk after lunch' },
  { time: '14:00', task: 'Back to work' },
  { time: '19:00', task: 'Work ends' },
  { time: '19:30', task: 'Dinner' },
  { time: '20:00', task: '20-min evening walk' },
  { time: '22:00', task: 'Wind down' },
  { time: '23:00', task: 'In bed' },
];

const WEEKEND_TIMELINE = [
  { time: '8:00', task: 'Wake up' },
  { time: '8:30', task: 'Breakfast' },
  { time: '13:00', task: 'Lunch' },
  { time: '13:30', task: '10-min walk after lunch' },
  { time: '19:30', task: 'Dinner' },
  { time: '20:00', task: 'Evening walk' },
  { time: '23:00', task: 'In bed' },
];

@Injectable()
export class ScheduleViewService {
  constructor(
    private readonly mealsService: MealsService,
    private readonly workoutsService: WorkoutsService,
    private readonly checklistService: ChecklistService,
    @InjectRepository(MealTemplate)
    private readonly mealTemplateRepo: Repository<MealTemplate>,
  ) {}

  async getToday(userId: number) {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const isGymDay = GYM_DAYS.includes(dayOfWeek);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let dayType = 'rest';
    if (isGymDay) dayType = 'gym';
    if (isWeekend) dayType = 'weekend';

    const timeline = isGymDay ? GYM_TIMELINE : isWeekend ? WEEKEND_TIMELINE : REST_TIMELINE;

    const templates = await this.mealTemplateRepo.find();
    const meals = this.mealsService.getMealsForDay(dayOfWeek, templates);

    const workoutTemplates = await this.workoutsService.getAllTemplates();
    const workout = workoutTemplates.find((w) => w.dayOfWeek === dayOfWeek) || null;

    const checklist = await this.checklistService.getToday(userId);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return {
      date: `${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`,
      dayName: dayNames[dayOfWeek],
      dayOfWeek,
      dayType,
      timeline,
      meals,
      workout,
      checklist,
    };
  }
}
