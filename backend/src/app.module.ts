import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { MealsModule } from './meals/meals.module';
import { ChecklistModule } from './checklist/checklist.module';
import { ScheduleViewModule } from './schedule/schedule.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get('DATABASE_URL');
        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            ssl: { rejectUnauthorized: false },
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
          };
        }
        return {
          type: 'postgres' as const,
          host: config.get<string>('DB_HOST', 'localhost'),
          port: +config.get<string>('DB_PORT', '5432'),
          username: config.get<string>('DB_USERNAME', 'postgres'),
          password: config.get<string>('DB_PASSWORD', ''),
          database: config.get<string>('DB_DATABASE', 'planner'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
    }),
    AuthModule,
    UsersModule,
    WorkoutsModule,
    MealsModule,
    ChecklistModule,
    ScheduleViewModule,
    SeedModule,
  ],
})
export class AppModule {}
