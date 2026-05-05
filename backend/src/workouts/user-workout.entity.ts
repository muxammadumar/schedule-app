import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { WorkoutTemplate } from './workout-template.entity';

@Entity('user_workouts')
export class UserWorkout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int' })
  dayOfWeek: number;

  @Column({ type: 'int', nullable: true })
  workoutTemplateId: number;

  @ManyToOne(() => WorkoutTemplate, { nullable: true, eager: true })
  @JoinColumn({ name: 'workoutTemplateId' })
  workoutTemplate: WorkoutTemplate;
}
