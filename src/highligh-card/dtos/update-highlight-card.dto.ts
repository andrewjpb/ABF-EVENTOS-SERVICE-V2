import { PartialType } from '@nestjs/swagger';
import { CreateHighlightCardDto } from './create-highlight-card.dto';

export class UpdateHighlightCardDto extends PartialType(CreateHighlightCardDto) {}
