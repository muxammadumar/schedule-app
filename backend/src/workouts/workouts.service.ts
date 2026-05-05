import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutTemplate } from './workout-template.entity';
import { UserWorkout } from './user-workout.entity';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(WorkoutTemplate)
    private readonly workoutTemplateRepo: Repository<WorkoutTemplate>,
    @InjectRepository(UserWorkout)
    private readonly userWorkoutRepo: Repository<UserWorkout>,
  ) {}

  getAllTemplates(): Promise<WorkoutTemplate[]> {
    return this.workoutTemplateRepo.find({ order: { id: 'ASC' } });
  }

  getTemplatesByDay(dayOfWeek: string): Promise<WorkoutTemplate[]> {
    return this.workoutTemplateRepo.find({ where: { dayOfWeek: parseInt(dayOfWeek) } });
  }

  async getMySchedule(userId: number) {
    const userWorkouts = await this.userWorkoutRepo.find({
      where: { userId },
      relations: ['workoutTemplate'],
      order: { dayOfWeek: 'ASC' },
    });
    const templates = await this.workoutTemplateRepo.find();
    const days = [1, 2, 3, 4, 5, 6, 0];
    return days.map((day) => {
      const userEntry = userWorkouts.find((uw) => uw.dayOfWeek === day);
      if (userEntry) return { dayOfWeek: day, workout: userEntry.workoutTemplate };
      const defaultTemplate = templates.find((t) => t.dayOfWeek === day);
      return { dayOfWeek: day, workout: defaultTemplate || null };
    });
  }

  async setMyWorkout(userId: number, dayOfWeek: number, workoutTemplateId: number) {
    let existing = await this.userWorkoutRepo.findOne({ where: { userId, dayOfWeek } });
    if (existing) {
      existing.workoutTemplateId = workoutTemplateId;
      return this.userWorkoutRepo.save(existing);
    }
    const entry = this.userWorkoutRepo.create({ userId, dayOfWeek, workoutTemplateId });
    return this.userWorkoutRepo.save(entry);
  }
}
