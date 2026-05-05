import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutTemplate } from '../workouts/workout-template.entity';
import { MealTemplate } from '../meals/meal-template.entity';

const WORKOUT_SEEDS = [
  {
    name: 'Push Day', type: 'strength', dayOfWeek: 1, description: 'Chest, shoulders, triceps',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8', notes: 'Main compound lift' },
      { name: 'Overhead Press', sets: 3, reps: '10', notes: '' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10', notes: '' },
      { name: 'Lateral Raise', sets: 3, reps: '15', notes: '' },
      { name: 'Tricep Pushdown', sets: 3, reps: '12', notes: '' },
      { name: 'Cable Fly', sets: 3, reps: '12', notes: '' },
    ],
  },
  {
    name: 'Pull Day', type: 'strength', dayOfWeek: 3, description: 'Back, biceps, rear delts',
    exercises: [
      { name: 'Lat Pulldown', sets: 4, reps: '10', notes: 'Wide grip' },
      { name: 'Cable Row', sets: 4, reps: '10', notes: '' },
      { name: 'Face Pull', sets: 3, reps: '15', notes: 'Rear delts + external rotation' },
      { name: 'Barbell Curl', sets: 3, reps: '10', notes: '' },
      { name: 'Hammer Curl', sets: 3, reps: '12', notes: '' },
      { name: 'Rear Delt Fly', sets: 3, reps: '15', notes: '' },
    ],
  },
  {
    name: 'Leg Day', type: 'strength', dayOfWeek: 5, description: 'Quads, hamstrings, glutes, calves',
    exercises: [
      { name: 'Squat', sets: 4, reps: '8', notes: 'Main compound lift' },
      { name: 'Leg Press', sets: 3, reps: '12', notes: '' },
      { name: 'Romanian Deadlift', sets: 3, reps: '10', notes: '' },
      { name: 'Leg Curl', sets: 3, reps: '12', notes: '' },
      { name: 'Calf Raise', sets: 4, reps: '15', notes: '' },
      { name: 'Leg Extension', sets: 3, reps: '12', notes: '' },
    ],
  },
  {
    name: 'Morning Run', type: 'cardio', dayOfWeek: null,
    description: '5km easy pace — before breakfast on gym days',
    exercises: [{ name: '5km Easy Run', sets: 1, reps: '5km', notes: 'Target pace: 6:00–6:30/km' }],
  },
  { name: 'Active Rest', type: 'rest', dayOfWeek: 2, description: 'Active rest — 20-min walk tonight', exercises: [] },
  { name: 'Active Rest', type: 'rest', dayOfWeek: 4, description: 'Active rest — 20-min walk tonight', exercises: [] },
  { name: 'Weekend Rest', type: 'rest', dayOfWeek: 6, description: 'Weekend — flexible activity', exercises: [] },
  { name: 'Weekend Rest', type: 'rest', dayOfWeek: 0, description: 'Weekend — flexible activity', exercises: [] },
];

const MEAL_SEEDS = [
  { name: 'Eggs + Kefir', mealType: 'breakfast', dayOfWeek: null, description: '3 eggs (scrambled or boiled) + 1 glass kefir', source: 'self', macros: { kcal: 350, protein: 32, carbs: 8, fat: 20 } },
  { name: 'Chicken + Rice + Chicken Soup', mealType: 'lunch', dayOfWeek: 1, description: 'Grilled chicken with rice and chicken soup — Chef Catering', source: 'chef_catering', macros: { kcal: 620, protein: 55, carbs: 65, fat: 12 } },
  { name: 'Manty + Lentil Soup', mealType: 'lunch', dayOfWeek: 2, description: 'Uzbek steamed dumplings with lentil soup — Chef Catering', source: 'chef_catering', macros: { kcal: 580, protein: 42, carbs: 60, fat: 18 } },
  { name: 'Mashkichiri or Shurpa', mealType: 'lunch', dayOfWeek: 3, description: 'Mung bean and rice porridge OR lamb/beef soup — Chef Catering', source: 'chef_catering', macros: { kcal: 550, protein: 38, carbs: 55, fat: 16 } },
  { name: 'Chicken + Rice + Mastava', mealType: 'lunch', dayOfWeek: 4, description: 'Chicken with rice and Mastava — Chef Catering', source: 'chef_catering', macros: { kcal: 580, protein: 50, carbs: 60, fat: 10 } },
  { name: 'Lagman + Chicken', mealType: 'lunch', dayOfWeek: 5, description: 'Hand-pulled noodle soup with chicken — Chef Catering', source: 'chef_catering', macros: { kcal: 600, protein: 48, carbs: 62, fat: 14 } },
  { name: 'Plov', mealType: 'lunch', dayOfWeek: 6, description: 'Uzbek rice pilaf — weekly treat, Chef Catering', source: 'chef_catering', macros: { kcal: 650, protein: 28, carbs: 80, fat: 22 } },
  { name: 'Nokhat Shurak or Gusht Say', mealType: 'lunch', dayOfWeek: 0, description: 'Chickpea dish or meat stew — Chef Catering', source: 'chef_catering', macros: { kcal: 520, protein: 45, carbs: 40, fat: 18 } },
  { name: 'Banana + Kefir', mealType: 'snack', dayOfWeek: 1, description: '1 banana + 1 glass kefir — pre-gym fuel at 5:30pm', source: 'self', macros: { kcal: 200, protein: 8, carbs: 32, fat: 2 } },
  { name: 'Banana + Kefir', mealType: 'snack', dayOfWeek: 3, description: '1 banana + 1 glass kefir — pre-gym fuel at 5:30pm', source: 'self', macros: { kcal: 200, protein: 8, carbs: 32, fat: 2 } },
  { name: 'Banana + Kefir', mealType: 'snack', dayOfWeek: 5, description: '1 banana + 1 glass kefir — pre-gym fuel at 5:30pm', source: 'self', macros: { kcal: 200, protein: 8, carbs: 32, fat: 2 } },
  { name: 'Beef + Buckwheat', mealType: 'dinner', dayOfWeek: 1, description: 'Beef with buckwheat — home-cooked', source: 'self', macros: { kcal: 520, protein: 48, carbs: 38, fat: 18 } },
  { name: 'Chicken + Buckwheat', mealType: 'dinner', dayOfWeek: 2, description: 'Chicken breast with buckwheat — home-cooked', source: 'self', macros: { kcal: 520, protein: 48, carbs: 38, fat: 14 } },
  { name: 'Beef + Potato Mash', mealType: 'dinner', dayOfWeek: 3, description: 'Beef with mashed potatoes — home-cooked', source: 'self', macros: { kcal: 520, protein: 48, carbs: 42, fat: 18 } },
  { name: 'Gusht Say + Buckwheat', mealType: 'dinner', dayOfWeek: 4, description: 'Gusht Say (meat stew) with buckwheat — home-cooked', source: 'self', macros: { kcal: 520, protein: 48, carbs: 38, fat: 18 } },
  { name: 'Beef or Chicken + Buckwheat', mealType: 'dinner', dayOfWeek: 5, description: 'Beef or chicken with buckwheat — home-cooked', source: 'self', macros: { kcal: 520, protein: 48, carbs: 38, fat: 16 } },
  { name: 'Chicken or Gusht Say + Buckwheat', mealType: 'dinner', dayOfWeek: 6, description: 'Chicken or Gusht Say with buckwheat — weekend dinner', source: 'self', macros: { kcal: 490, protein: 46, carbs: 36, fat: 16 } },
  { name: 'Chicken or Gusht Say + Buckwheat', mealType: 'dinner', dayOfWeek: 0, description: 'Chicken or Gusht Say with buckwheat — weekend dinner', source: 'self', macros: { kcal: 490, protein: 46, carbs: 36, fat: 16 } },
];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(WorkoutTemplate)
    private readonly workoutTemplateRepo: Repository<WorkoutTemplate>,
    @InjectRepository(MealTemplate)
    private readonly mealTemplateRepo: Repository<MealTemplate>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedWorkouts();
    await this.seedMeals();
  }

  async seedWorkouts() {
    const count = await this.workoutTemplateRepo.count();
    if (count > 0) return;
    await this.workoutTemplateRepo.save(WORKOUT_SEEDS as any[]);
    console.log('✓ Workouts seeded');
  }

  async seedMeals() {
    const count = await this.mealTemplateRepo.count();
    if (count > 0) return;
    await this.mealTemplateRepo.save(MEAL_SEEDS as any[]);
    console.log('✓ Meals seeded');
  }
}
