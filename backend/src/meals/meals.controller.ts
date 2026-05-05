import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MealsService } from './meals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get('templates')
  getTemplates() {
    return this.mealsService.getAllTemplates();
  }

  @Get('templates/:day')
  getTemplatesByDay(@Param('day') day: string) {
    return this.mealsService.getTemplatesByDay(day);
  }

  @Get('my-plan')
  getMyPlan(@Request() req) {
    return this.mealsService.getMyPlan(req.user.id);
  }

  @Post('my-plan')
  setMyMeal(@Request() req, @Body() body: { dayOfWeek: number; mealType: string; mealTemplateId: number }) {
    return this.mealsService.setMyMeal(req.user.id, body.dayOfWeek, body.mealType, body.mealTemplateId);
  }
}
