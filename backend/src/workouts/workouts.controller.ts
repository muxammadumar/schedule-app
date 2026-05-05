import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get('templates')
  getTemplates() {
    return this.workoutsService.getAllTemplates();
  }

  @Get('templates/:day')
  getTemplatesByDay(@Param('day') day: string) {
    return this.workoutsService.getTemplatesByDay(day);
  }

  @Get('my-schedule')
  getMySchedule(@Request() req) {
    return this.workoutsService.getMySchedule(req.user.id);
  }

  @Post('my-schedule')
  setMyWorkout(@Request() req, @Body() body: { dayOfWeek: number; workoutTemplateId: number }) {
    return this.workoutsService.setMyWorkout(req.user.id, body.dayOfWeek, body.workoutTemplateId);
  }
}
