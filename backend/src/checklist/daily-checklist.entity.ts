import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('daily_checklists')
export class DailyChecklist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @Column({ type: 'jsonb', default: '{}' })
  tasks: Record<string, boolean>;

  @Column({ type: 'boolean', default: false })
  allCompleted: boolean;

  @Column({ type: 'int', default: 0 })
  streak: number;
}
