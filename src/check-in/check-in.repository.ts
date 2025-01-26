import { Injectable } from '@nestjs/common';
import { AttendanceList } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { CustomLogger } from '../log/custom.logger';
import { CheckSubscribeDto } from './dto/check-subscribe.dto';
import { UnauthorizedRrror } from 'shared/errors/unauthorized.rrror';
import { EntityNotFoundError } from 'shared/errors/entity-not-found.error';
import { PaginationParamsDto } from './dto/CheckSubscribeDto';

@Injectable()
export class CheckInRepository {
    private readonly logger = CustomLogger.getLogger(CheckInRepository.name);

    constructor(private readonly prisma: PrismaService) {}

    async subscribe(eventId: string, checkInDto: CreateCheckInDto): Promise<AttendanceList> {
        try {
            return await this.prisma.attendanceList.create({
                data: { eventId, ...checkInDto },
            });
        } catch (error) {
            this.logger.error(error.message);
            return null;
        }
    }

    async getAttendanceListById(id: string) {
        return this.prisma.attendanceList.findUnique({
            where: { id },
        });
    }

    async getAttendanceListByEvent(eventId: string, skip: number, take: number) {
        return this.prisma.attendanceList.findMany({
            where: { eventId },
            skip,
            take,
        });
    }

    async countAttendanceByEvent(eventId: string) {
        return this.prisma.attendanceList.count({
            where: { eventId },
        });
    }

    async getAttendanceListByUser(userId: string, skip: number, take: number) {
        return this.prisma.attendanceList.findMany({
            where: { userId },
            skip,
            take,
        });
    }

    async getAttendanceListByEventAndEmail(eventId: string, email: string) {
        return this.prisma.attendanceList.findFirst({
            where: {
                eventId,
                attendee_email: email,
            },
        });
    }

    async getAttendanceListByEventAndCompany(eventId: string, cnpj: string): Promise<AttendanceList[]> {
        return this.prisma.attendanceList.findMany({
            where: {
                eventId,
                company_cnpj: cnpj,
            },
        });
    }

    async getAttendanceByEventAndSubscriber(eventId: string, email: string, rg: string, cpf: string) {
        return this.prisma.attendanceList.findFirst({
            where: {
                eventId,
                attendee_email: email,
                attendee_rg: rg,
                attendee_cpf: cpf,
            },
        });
    }

    async deleteSubscription(id: string) {
        return this.prisma.attendanceList.delete({
            where: { id },
        });
    }

    async updateAttendanceList(attendanceList: AttendanceList) {
        await this.prisma.attendanceList.update({
            where: { id: attendanceList.id },
            data: { ...attendanceList },
        });
    }

    //crido por Andrew
    async searchAttendanceByParams(data: CheckSubscribeDto, pagination: PaginationParamsDto) {
        const { cnpj, idEvento, cpf } = data;
        const { offset, size, contains } = pagination;

        const attendanceFilter: any = {};

        if (cnpj) attendanceFilter.company_cnpj = cnpj;
        if (idEvento) attendanceFilter.eventId = idEvento;
        if (cpf) attendanceFilter.attendee_cpf = cpf;

        // Filtragem baseada no termo 'contains'
        if (contains) {
            attendanceFilter.OR = [
                { company_cnpj: { contains } },
                { attendee_rg: { contains } },
                { attendee_cpf: { contains } },
                { attendee_email: { contains } },
                { attendee_full_name: { contains } },
            ];
        }

        // Consulta para dados paginados
        const attendees = await this.prisma.attendanceList.findMany({
            where: attendanceFilter,
            skip: offset ?? 0,
            take: size ?? 10,
            include: {
                event: true,
                company: true,
                user: true,
            },
        });

        // Contagem total de registros que correspondem ao filtro
        const total = await this.prisma.attendanceList.count({
            where: attendanceFilter,
        });

        const totalCheckedIn = await this.prisma.attendanceList.count({
            where: { ...attendanceFilter, checked_in: true },
        });

        // Consulta para agrupamento (sem considerar paginação)
        const allAttendeesForGrouping = await this.prisma.attendanceList.findMany({
            where: attendanceFilter,
            include: {
                company: true, // Presumindo que o agrupamento é por 'company_segment'
            },
        });

        // Agrupamento por segmento
        const groupedBySegment = this.groupBySegment(allAttendeesForGrouping);
        const groupByAttendeeType = this.groupByAttendeeType(allAttendeesForGrouping);

        return {
            total,
            attendees,
            groupedBySegment,
            groupByAttendeeType,
            totalCheckedIn,
        };
    }

    groupBySegment(data: Array<any>): Array<{ name: string; total: number }> {
        const segmentCount: { [key: string]: number } = {};

        data.forEach((item) => {
            const segment = item.company_segment;
            if (segmentCount[segment]) {
                segmentCount[segment]++;
            } else {
                segmentCount[segment] = 1;
            }
        });

        return Object.entries(segmentCount).map(([name, total]) => ({
            name,
            total,
        }));
    }
    groupByAttendeeType(data: Array<any>): Array<{ type: string; total: number }> {
        const typeCount: { [key: string]: number } = {};

        data.forEach((item) => {
            const type = item.attendee_type;
            if (typeCount[type]) {
                typeCount[type]++;
            } else {
                typeCount[type] = 1;
            }
        });

        return Object.entries(typeCount).map(([type, total]) => ({
            type,
            total,
        }));
    }

    //criado por Andrew
    async checkEventVacancies(data: { idEvento: string; cnpj?: string }) {
        const { cnpj, idEvento } = data;
    
        // Se idEvento não for fornecido, retornar erro
        if (!idEvento) {
            throw new UnauthorizedRrror('O ID do evento é obrigatório para verificar vagas.');
        }
    
        // Buscar informações do evento
        const event = await this.prisma.event.findUnique({
            where: { id: idEvento },
            select: {
                vacancy_total: true,
                vacancies_per_brand: true,
            },
        });
    
        if (!event) {
            throw new EntityNotFoundError('Evento não encontrado.');
        }
    
        // Calcular vagas totais restantes
        const totalAttendees = await this.prisma.attendanceList.count({
            where: { eventId: idEvento },
        });
    
        const vacanciesLeft = Math.max(event.vacancy_total - totalAttendees, 0);
        console.log(vacanciesLeft);
        // Verificar vagas para a marca (se CNPJ for fornecido)
        if (cnpj) {
            const companyAttendees = await this.prisma.attendanceList.count({
                where: { eventId: idEvento, company_cnpj: cnpj, AND: {
                    attendee_type: "in_person"
                } },
            });
           
            const companyVacanciesLeft = event.vacancies_per_brand
                ? Math.max(event.vacancies_per_brand - companyAttendees, 0)
                : 0;
    
            return {
                totalVacanciesLeft: vacanciesLeft,
                companyVacanciesLeft: companyVacanciesLeft,
            };
        }
    
        // Retornar apenas vagas totais se CNPJ não for fornecido
        return {
            totalVacanciesLeft: vacanciesLeft,
        };
    }
    

    async findById(id: string) {
        return this.prisma.attendanceList.findUnique({
            where: { id },
        });
    }
    async editAttendanceById({ attendanceList, id }: { id: string; attendanceList: Partial<AttendanceList> }) {
        return this.prisma.attendanceList.update({
            where: { id },
            data: { ...attendanceList },
        });
    }
}
