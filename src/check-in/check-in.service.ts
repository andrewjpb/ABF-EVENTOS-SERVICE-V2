import { Injectable } from '@nestjs/common';
import { Result } from '../../shared/result/result.model';
import { EntityNotFoundError } from '../../shared/errors/entity-not-found.error';
import { AlreadyExistsError } from '../../shared/errors/already-exists.error';
import { CheckInRepository } from './check-in.repository';
import { AttendanceList, Event } from '@prisma/client';
import { CustomLogger } from '../log/custom.logger';
import { DateUtil } from '../util/date.util';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { CheckSubscribeDto } from './dto/check-subscribe.dto';
import { PaginationParamsDto } from './dto/CheckSubscribeDto';

@Injectable()
export class CheckInService {
    private readonly logger = CustomLogger.getLogger(CheckInService.name);

    constructor(private readonly checkInRepo: CheckInRepository) {}

    async subscribeToEvent(event: Event, checkInDto: CreateCheckInDto): Promise<Result> {
        const today = DateUtil.getTodayWithoutTime();
        this.logger.info('Event date: ' + event.date);
        this.logger.info('Event time: ' + event.date.getTime());
        this.logger.info('Current date: ' + today);
        this.logger.info('Current time: ' + today.getTime());
        if (event.date.getTime() < today.getTime()) {
            const message = `não é possível se inscrever em eventos já realizados`;
            this.logger.error(message);
            return new Result(message, null, new EntityNotFoundError(message));
        }

        const alreadySubscribed: AttendanceList = await this.attendanceByEventAndEmail(
            event.id,
            checkInDto.attendee_email,
        );
        if (alreadySubscribed) {
            const message = `participante já inscrito no evento`;
            this.logger.error(message);
            return new Result(message, null, new EntityNotFoundError(message));
        }
        const brandSpotsUsed = await this.brandSpotsUsed(event.id, checkInDto.company_cnpj);
        if (brandSpotsUsed >= event.vacancies_per_brand) {
            if (event.format === 'in_person' || (event.format !== 'in_person' && !event.free_online)) {
                const message = `limite de inscricoes da marca ja atingido`;
                this.logger.error(message);
                return new Result(message, null, new EntityNotFoundError(message));
            }
        }

        const subscription = await this.checkInRepo.subscribe(event.id, checkInDto);

        if (subscription) {
            const message = 'inscrição realizada com sucesso';
            this.logger.info(message);
            return new Result(message, subscription, null);
        } else {
            const message = `erro ao realizar inscrição`;
            this.logger.error(message);
            return new Result(message, null, new AlreadyExistsError(message));
        }
    }

    async attendanceByUser(userId: string, skip: number, take: number): Promise<AttendanceList[]> {
        this.logger.info(`buscando confirmações de presença para o usuário: ${userId}`);
        return this.checkInRepo.getAttendanceListByUser(userId, skip, take);
    }

    async attendanceByEvent(eventId: string, skip: number, take: number): Promise<AttendanceList[]> {
        this.logger.info(`buscando confirmações de presença para o evento: ${eventId}`);
        return this.checkInRepo.getAttendanceListByEvent(eventId, skip, take);
    }

    async countAttendanceByEvent(eventId: string): Promise<number> {
        this.logger.info(`buscando confirmações de presença para o evento: ${eventId}`);
        return this.checkInRepo.countAttendanceByEvent(eventId);
    }

    async attendanceByEventAndEmail(eventId: string, attendeeEmail: string): Promise<AttendanceList> {
        this.logger.info(`buscando confirmações de presença para o evento: ${eventId}`);
        return await this.checkInRepo.getAttendanceListByEventAndEmail(eventId, attendeeEmail);
    }

    async brandSpotsUsed(eventId: string, cnpj: string): Promise<number> {
        this.logger.info(`buscando cota da empresa para o evento: ${eventId}`);
        return (await this.checkInRepo.getAttendanceListByEventAndCompany(eventId, cnpj)).length;
    }

    async removeSubscription(eventId: string, email: string, rg: string, cpf: string) {
        const subscription = await this.checkInRepo.getAttendanceByEventAndSubscriber(eventId, email, rg, cpf);
        if (!subscription) {
            const message = 'inscrição não encontrada';
            this.logger.error(message);
            return new Result(message, null, new EntityNotFoundError(message));
        }

        try {
            await this.checkInRepo.deleteSubscription(subscription.id);
            const message = 'inscrição removida com sucesso';
            this.logger.info(message);
            return new Result(message, subscription, null);
        } catch (error) {
            this.logger.error(error.message);
            return new Result(error.message, null, new Error(error.message));
        }
    }

    async doCheckIn(id: string) {
        const attendanceList = await this.checkInRepo.getAttendanceListById(id);
        attendanceList.checked_in = true;
        await this.checkInRepo.updateAttendanceList(attendanceList);
    }

    async searchAttendanceByParams(data: CheckSubscribeDto, pagination: PaginationParamsDto) {
        const res = await this.checkInRepo.searchAttendanceByParams(data, pagination);

        return res;
    }

    async getVacanciesByEvent({ idEvento, cnpj }: { idEvento: string; cnpj?: string }) {
        return this.checkInRepo.checkEventVacancies({ cnpj, idEvento });
    }
}
