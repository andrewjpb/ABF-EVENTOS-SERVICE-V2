// src/event/v2/usecases/remove/controller/deleteEvent.controller.ts
import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteEventService } from '../services/deleteEvent.service';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('v2/event') // ou outro nome que você preferir
@Controller('v2/event/delete')
export class DeleteEventController {
    constructor(private readonly deleteEventService: DeleteEventService) {}

    @UseGuards(AuthGuard)
    @Delete(':eventId')
    @ApiOperation({ summary: 'Deleta um evento pelo seu ID' })
    @ApiParam({
        name: 'eventId',
        description: 'ID do evento que será deletado',
    })
    @ApiResponse({ status: 204, description: 'Evento excluído com sucesso' })
    async handle(@Param('eventId') eventId: string): Promise<void> {
        await this.deleteEventService.execute(eventId);
    }
}
