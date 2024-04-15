import { PartialType } from '@nestjs/swagger';
import { CreateExternalEventDto } from './create-external-event.dto';

export class UpdateExternalEventDto extends PartialType(CreateExternalEventDto) {}
