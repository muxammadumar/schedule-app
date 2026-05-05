import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyChecklist } from './daily-checklist.entity';

const GYM_DAYS = [1, 3, 5];

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function getDefaultTasks(dayOfWeek: number): Record<string, boolean> {
  const isGymDay = GYM_DAYS.includes(dayOfWeek);
  return {
    ...(isGymDay ? { morningRun: false, gymSession: false } : {}),
    water3L: false,
    lunchWalk: false,
    bedBy11: false,
  };
}

function checkAllCompleted(tasks: Record<string, boolean>, dayOfWeek: number): boolean {
  const defaults = getDefaultTasks(dayOfWeek);
  return Object.keys(defaults).every((k) => tasks[k] === true);
}

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(DailyChecklist)
    private readonly checklistRepo: Repository<DailyChecklist>,
  ) {}

  async getToday(userId: number): Promise<DailyChecklist> {
    const date = todayStr();
    let entry = await this.checklistRepo.findOne({ where: { userId, date } });
    if (!entry) {
      const dayOfWeek = new Date().getDay();
      const streak = await this.getCurrentStreak(userId);
      entry = this.checklistRepo.create({
        userId,
        date,
        tasks: getDefaultTasks(dayOfWeek),
        allCompleted: false,
        streak,
      });
      entry = await this.checklistRepo.save(entry);
    }
    return entry;
  }

  async updateTask(userId: number, task: string, completed: boolean): Promise<DailyChecklist> {
    const date = todayStr();
    let entry = await this.checklistRepo.findOne({ where: { userId, date } });
    const dayOfWeek = new Date().getDay();
    if (!entry) {
      const streak = await this.getCurrentStreak(userId);
      entry = this.checklistRepo.create({
        userId,
        date,
        tasks: getDefaultTasks(dayOfWeek),
        allCompleted: false,
        streak,
      });
    }
    entry.tasks = { ...entry.tasks, [task]: completed };
    const wasCompleted = entry.allCompleted;
    entry.allCompleted = checkAllCompleted(entry.tasks, dayOfWeek);
    if (!wasCompleted && entry.allCompleted) {
      const prev = await this.getCurrentStreak(userId);
      entry.streak = prev + 1;
    }
    return this.checklistRepo.save(entry);
  }

  async getCurrentStreak(userId: number): Promise<number> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yd = yesterday.toISOString().split('T')[0];
    const entry = await this.checklistRepo.findOne({ where: { userId, date: yd } });
    return entry && entry.allCompleted ? entry.streak : 0;
  }
}
