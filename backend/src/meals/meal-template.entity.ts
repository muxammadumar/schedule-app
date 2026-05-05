import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('meal_templates')
export class MealTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  mealType: string; // breakfast | lunch | dinner | snack

  @Column({ type: 'int', nullable: true })
  dayOfWeek: number | null; // null = every day (breakfast)

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  source: string; // "self" | "chef_catering"

  @Column({ type: 'jsonb' })
  macros: { kcal: number; protein: number; carbs: number; fat: number };
}
