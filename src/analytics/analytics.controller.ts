import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('v2/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('registrations')
  async getEventRegistrations() {
    return await this.analyticsService.getEventRegistrations();
  }

  @Get('checkin-rate')
  async getCheckInRate() {
    return await this.analyticsService.getCheckInRate();
  }
} 