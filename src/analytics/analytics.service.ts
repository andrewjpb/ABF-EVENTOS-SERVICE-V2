import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from './repositories/analytics.repository';

@Injectable()
export class AnalyticsService {
  constructor(private analyticsRepository: AnalyticsRepository) {}

  async getEventRegistrations() {
    const registrations = await this.analyticsRepository.findEventRegistrations();
    return registrations;
  }

  async getCheckInRate() {
    const checkInData = await this.analyticsRepository.findCheckInRate();
    return checkInData.map(event => ({
      id: event.id,
      title: event.title,
      totalAttendees: event.AttendanceList.length,
      checkedIn: event.AttendanceList.filter(a => a.checked_in).length,
      checkInRate: `${((event.AttendanceList.filter(a => a.checked_in).length / event.AttendanceList.length) * 100).toFixed(2)}%`
    }));
  }
} 