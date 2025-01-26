// src/external-event/v2/delete/controller/deleteExternalEvent.controller.ts
import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteExternalEventService } from '../services/deleteExternalEvent.service';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('v2/external-event')
@Controller('v2/external-event/delete')
export class DeleteExternalEventController {
    constructor(private readonly deleteExternalEventService: DeleteExternalEventService) {}

    @UseGuards(AuthGuard)
    @Delete(':externalEventId')
    @ApiOperation({ summary: 'Deleta um external event pelo seu ID' })
    @ApiParam({
        name: 'externalEventId',
        description: 'ID do external event que será deletado',
    })
    @ApiResponse({ status: 200, description: 'ExternalEvent excluído com sucesso' })
    async handle(@Param('externalEventId') externalEventId: string): Promise<void> {
        await this.deleteExternalEventService.execute(externalEventId);
    }
}
