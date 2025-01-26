import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca todos os eventos com suas respectivas listas de presença
   * Utilizado para análise de registros/inscrições em eventos
   */
  async findEventRegistrations() {
    return this.prisma.event.findMany({
      include: {
        AttendanceList: true
      }
    });
  }

  /**
   * Busca todos os eventos com suas listas de presença
   * Utilizado para calcular a taxa de check-in dos eventos
   */
  async findCheckInRate() {
    return this.prisma.event.findMany({
      include: {
        AttendanceList: true
      }
    });
  }
} 