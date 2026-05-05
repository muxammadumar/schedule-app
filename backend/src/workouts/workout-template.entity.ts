import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('workout_templates')
export class WorkoutTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  type: string; // "strength" | "cardio" | "rest"

  @Column({ type: 'int', nullable: true })
  dayOfWeek: number | null; // 1=Mon, 3=Wed, 5=Fri, null=all gym days (morning run)

  @Column({ type: 'jsonb', nullable: true })
  exercises: Array<{ name: string; sets: number; reps: string; notes: string }>;

  @Column({ type: 'text', nullable: true })
  description: string;
}
