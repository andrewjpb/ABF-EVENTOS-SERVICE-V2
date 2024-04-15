import { Event } from '@prisma/client';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import slugify from 'slugify';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventUtils {
    getEventSlug(event: Event | CreateEventDto | UpdateEventDto) {
        return slugify(`${event.title}-${event.date}`);
    }
}
