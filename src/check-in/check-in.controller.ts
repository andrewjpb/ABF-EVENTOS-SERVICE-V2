import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    Request,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { EventService } from '../event/event.service';
import { UsersService } from '../users/users.service';
import { CustomLogger } from '../log/custom.logger';
import { CheckInService } from './check-in.service';
import { AuthGuard } from '../auth/auth.guard';
// import { QrCodeUtils } from '../util/qr-code.utils';
import { JobService } from '../jobs/job.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { CompanyService } from '../company/company.service';
import { Address, AttendanceList, Company, Event } from '@prisma/client';
import { AddressService } from '../address/address.service';
import { CreateEventAttendeeDto } from './dto/create-event-attendee.dto';
import { format } from 'date-fns';
import { CheckSubscribeDto } from './dto/check-subscribe.dto';
import { RemoveSubscribeDto } from './dto/remove-subscrive.dto';
import { PaginationParamsDto } from './dto/CheckSubscribeDto';
import { SubscribeAdminDto } from './dto/subscribe-admin.dto';
import { EditAttendanceById } from './use-cases/edit-attendance/edit-attendance-by-id.use-case';
import { EditeSubscribeDto } from './dto/edit-attendance.dto';

@ApiTags('Check-in')
@Controller('attendance')
export class CheckInController {
    private readonly logger = CustomLogger.getLogger(CheckInController.name);

    constructor(
        private readonly eventService: EventService,
        private readonly userService: UsersService,
        private readonly checkInService: CheckInService,
        private readonly jobService: JobService,
        private readonly companyService: CompanyService,
        private readonly addressService: AddressService,
        private readonly editAttendanceById: EditAttendanceById,
    ) {}

    @UseGuards(AuthGuard)
    @Post('subscribe')
    async subscribe(
        @Body() createEventAttendeeDto: CreateEventAttendeeDto,
        @Request() req: Request,
        @Res() response: Response,
    ): Promise<any> {
        const {
            attendee_full_name,
            attendee_email,
            attendee_position,
            attendee_rg,
            attendee_cpf,
            mobile_phone,
            attendee_type,
            eventId,
        } = createEventAttendeeDto;
        const userResult = await this.userService.findById(req['user']);
        const user = this.userService.sanitizeUser(userResult.data);
        const event = await this.validateEvent(eventId, response);
        const companyResult = await this.companyService.getCompanyByCnpj(user.cnpj);
        const company: Company = companyResult.data;
        const detailEvent = await this.eventService.findById(eventId);
        const sponsorsFormated = detailEvent.data.sponsors.map((sponsor) => {
            return {
                image: 'https://eventosabf.andrew.eti.br/files/image?path=' + sponsor.image_url,
                description: sponsor.description,
            };
        });

        return this.makeSubscription({
            userId: user.id,
            company,
            attendee_full_name,
            attendee_email,
            attendee_position,
            attendee_rg,
            attendee_cpf,
            event,
            response,
            mobile_phone,
            attendee_type,
            sponsors: sponsorsFormated,
        });
    }

    //criado por Andrew
    @Post('vacancies/:eventId')
    async checkEventVacancies(@Param('eventId') eventId: string, @Body('cnpj') cnpj: string) {
        if (cnpj) {
            return this.checkInService.getVacanciesByEvent({ idEvento: eventId, cnpj: cnpj });
        }
        return this.checkInService.getVacanciesByEvent({ idEvento: eventId });
    }

    //criado por Andrew
    @Post('search')
    async checkSubscription(@Body() data: CheckSubscribeDto, @Query() pagination: PaginationParamsDto) {
        const res = await this.checkInService.searchAttendanceByParams(data, pagination);
        return {
            total: res.total,
            groupedBySegment: res.groupedBySegment,
            groupByAttendeeType: res.groupByAttendeeType,
            data: res.attendees,
            totalCheckedIn: res.totalCheckedIn,
        };
    }

    @UseGuards(AuthGuard)
    @Post('subscribe/admin')
    async subscribeAdmin(
        @Body() data: SubscribeAdminDto,
        @Request() req: Request,
        @Res() response: Response,
    ): Promise<any> {
        const {
            attendee_email,
            attendee_position,
            attendee_full_name,
            attendee_type,
            attendee_cpf,
            attendee_rg,
            mobile_phone,
            eventId,
            cnpj,
        } = data;
        const userResult = await this.userService.findById(req['user']);
        const admin = this.userService.sanitizeUser(userResult.data);
        const event = await this.validateEvent(eventId, response);
        const companyResult = await this.companyService.getCompanyByCnpj(cnpj);

        if (companyResult.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: companyResult.error.message });
        }

        const company: Company = companyResult.data;

        return this.makeSubscription({
            userId: admin.id,
            company,
            attendee_full_name,
            attendee_email,
            attendee_position,
            attendee_rg,
            attendee_cpf,
            event,
            response,
            mobile_phone,
            attendee_type,
            sponsors: [],
        });
    }

    private async makeSubscription({
        attendee_cpf,
        attendee_email,
        attendee_full_name,
        attendee_position,
        attendee_rg,
        attendee_type,
        company,
        event,
        mobile_phone,
        response,
        userId,
        sponsors,
    }: {
        userId: string;
        company: Company;
        attendee_full_name: string;
        attendee_email: string;
        attendee_position: string;
        attendee_rg: string;
        attendee_cpf: string;
        event: Event;
        response: Response;
        mobile_phone: string;
        attendee_type: string;
        sponsors: Array<{ image: string; description: string }>;
    }) {
        const checkInDto = new CreateCheckInDto();
        checkInDto.userId = userId;
        checkInDto.company_cnpj = company.cnpj;
        checkInDto.company_segment = company.segment;
        checkInDto.attendee_full_name = attendee_full_name;
        checkInDto.attendee_email = attendee_email;
        checkInDto.attendee_position = attendee_position;
        checkInDto.attendee_rg = attendee_rg;
        checkInDto.attendee_cpf = attendee_cpf;
        checkInDto.checked_in = false;
        checkInDto.mobile_phone = mobile_phone;
        checkInDto.attendee_type = attendee_type;

        const attendanceCount = await this.checkInService.countAttendanceByEvent(event.id);
        if (attendanceCount >= event.vacancy_total && !event.free_online) {
            const message = `limite de inscricoes do evento ja atingido`;
            this.logger.error(message);
            return response.status(HttpStatus.NOT_MODIFIED).json({ message });
        }

        const addressResult = await this.addressService.findOne(event.addressId);
        const address: Address = addressResult.data;
        const city = await this.addressService.cityById(address.cityId);
        const state = await this.addressService.stateById(address.stateId);

        const result = await this.checkInService.subscribeToEvent(event, checkInDto);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }

        // TODO - enviar email aqui
        await this.jobService.pushSubscriptionEmailJob({
            name: checkInDto.attendee_full_name,
            email: checkInDto.attendee_email,
            eventTitle: event.title,
            eventDate: format(new Date(event.date), 'dd/MM/yyyy'),
            address: `${address.street}, ${address.number} - ${city.data.name}/${state.data.uf} ${
                address.complement && ` - ${address.complement}`
            }`,
            eventType: event.format,
            link: event.transmission_link,
            schedule_link: event.schedule_link,
            sponsors: sponsors,
        });

        return response.status(HttpStatus.ACCEPTED).json({
            message: 'inscrição realizada com sucesso',
        });
    }

    @UseGuards(AuthGuard)
    @Delete()
    async removeSubscription(@Body() data: RemoveSubscribeDto) {
        const result = await this.checkInService.removeSubscription(
            data.eventId,
            data.attendee_email,
            data.attendee_rg,
            data.attendee_cpf,
        );
        if (result.error) {
            return { error: result.error.message };
        }
        return { message: 'inscrição removida com sucesso' };
    }

    @UseGuards(AuthGuard)
    @Post('unsubscribe/:eventId')
    async unsubscribe(
        @Param('eventId') eventId: string,
        @Body('attendee_email') attendee_email: string,
        @Body('attendee_rg') attendee_rg: string,
        @Body('attendee_cpf') attendee_cpf: string,
        @Request() req: Request,
        @Res() response: Response,
    ): Promise<any> {
        const result = await this.checkInService.removeSubscription(eventId, attendee_email, attendee_rg, attendee_cpf);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.error.message });
        }
        return response.status(HttpStatus.ACCEPTED).json({
            message: 'inscrição removida com sucesso',
        });
    }

    @UseGuards(AuthGuard)
    @Get('spots/:companyId/:eventId')
    async getRemainingSpots(
        @Param('companyId') companyId: string,
        @Param('eventId') eventId: string,
        @Res() response: Response,
    ) {
        console.log('HELLO');

        const companyResult = await this.companyService.getCompanyById(companyId);
        const eventResult = await this.eventService.findById(eventId);

        if (eventResult.error || companyResult.error) {
            const errors: { error: string }[] = [];
            if (!!eventResult.error) errors.push({ error: eventResult.error.message });
            if (!!companyResult.error) errors.push({ error: companyResult.error.message });

            return response.status(HttpStatus.BAD_REQUEST).json({ ...errors });
        }

        const event: Event = eventResult.data;
        const company: Company = companyResult.data;

        const used = await this.checkInService.brandSpotsUsed(eventId, company.cnpj);

        const remaining = event.vacancies_per_brand - used;
        return response.status(HttpStatus.ACCEPTED).json({
            spots: remaining >= 0 ? remaining : 0,
        });
    }

    @UseGuards(AuthGuard)
    @Post('check-in')
    async checkIn(
        @Body('event-id') eventId: string,
        @Body('attendee-email') attendeeEmail: string,
        @Res() response: Response,
    ) {
        // const qrCode = await QrCodeUtils.generateQrCode({
        //     event: eventId,
        //     user: attendeeEmail,
        // });

        const attendanceList: AttendanceList = await this.checkInService.attendanceByEventAndEmail(
            eventId,
            attendeeEmail,
        );

        if (!attendanceList) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: 'inscrição não encontrada' });
        } else if (attendanceList.checked_in) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: 'check-in já realizado' });
        }

        await this.checkInService.doCheckIn(attendanceList.id);
        // await this.jobService.pushCheckInEmailJob(
        //     attendanceList.attendee_full_name,
        //     attendanceList.attendee_email,
        //     qrCode,
        // );

        this.logger.info('check-in realizado com sucesso');

        return response.status(HttpStatus.ACCEPTED).json({
            message: 'check-in realizado com sucesso',
        });
    }

    @UseGuards(AuthGuard)
    @Get('/by-user/:id')
    async getAttendanceListByUser(
        @Query('offset') skip: number,
        @Query('size') take: number,
        @Param('id') userId: string,
        @Res() response: Response,
    ) {
        skip = skip ? skip : 0;
        take = take && take >= 100 ? take : 100;
        return response
            .status(HttpStatus.ACCEPTED)
            .json(await this.checkInService.attendanceByUser(userId, skip, take));
    }

    @UseGuards(AuthGuard)
    @Get('/by-event/:id')
    async getAttendanceListByEvent(
        @Query('offset') skip: number,
        @Query('size') take: number,
        @Param('id') eventId: string,
        @Res() response: Response,
    ) {
        skip = skip ? skip : 0;
        take = take && take >= 100 ? take : 100;
        const eventResult = await this.eventService.findById(eventId);
        if (eventResult.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: 'evento não localizado, check-in não realizado',
            });
        }

        return response
            .status(HttpStatus.ACCEPTED)
            .json(await this.checkInService.attendanceByEvent(eventId, skip, take));
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    async editAttendanceList(@Param('id') attendanceId: string, @Body() data: EditeSubscribeDto) {
        return this.editAttendanceById.execute({ attendanceId, data });
    }

    private async validateEvent(eventId: string, response: Response) {
        const eventResult = await this.eventService.findById(eventId);
        if (eventResult.error) {
            const message = 'evento não localizado, check-in não realizado';
            this.logger.error(message);
            return response.status(HttpStatus.BAD_REQUEST).json({
                message: message,
            });
        }

        return eventResult.data;
    }
}
