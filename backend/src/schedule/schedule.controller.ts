import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ScheduleViewService } from './schedule.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('schedule')
export class ScheduleViewController {
  constructor(private readonly scheduleService: ScheduleViewService) {}

  @Get('today')
  getToday(@Request() req) {
    return this.scheduleService.getToday(req.user.id);
  }
}
