// src/highlight-card/v2/delete/deleteHighlightCard.controller.ts
import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { DeleteHighlightCardService } from '../delete/deleteHighlightCard.service';

@ApiTags('v2/highlight-card')
@Controller('v2/highlight-card/delete')
export class DeleteHighlightCardController {
    constructor(private readonly deleteHighlightCardService: DeleteHighlightCardService) {}

    @UseGuards(AuthGuard)
    @Delete(':cardId')
    @ApiOperation({ summary: 'Deleta um highlight card pelo ID' })
    @ApiParam({
        name: 'cardId',
        description: 'ID do highlight card que será deletado',
    })
    @ApiResponse({ status: 204, description: 'HighlightCard excluído com sucesso' })
    async handle(@Param('cardId') cardId: string): Promise<void> {
        await this.deleteHighlightCardService.execute(cardId);
    }
}
