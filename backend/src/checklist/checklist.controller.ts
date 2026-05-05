import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('checklist')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Get('today')
  getToday(@Request() req) {
    return this.checklistService.getToday(req.user.id);
  }

  @Patch('today')
  updateTask(@Request() req, @Body() body: { task: string; completed: boolean }) {
    return this.checklistService.updateTask(req.user.id, body.task, body.completed);
  }
}
