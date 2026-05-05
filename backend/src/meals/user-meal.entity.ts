import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { MealTemplate } from './meal-template.entity';

@Entity('user_meals')
export class UserMeal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int' })
  dayOfWeek: number;

  @Column({ type: 'varchar' })
  mealType: string;

  @Column({ type: 'int', nullable: true })
  mealTemplateId: number;

  @ManyToOne(() => MealTemplate, { nullable: true, eager: true })
  @JoinColumn({ name: 'mealTemplateId' })
  mealTemplate: MealTemplate;
}
