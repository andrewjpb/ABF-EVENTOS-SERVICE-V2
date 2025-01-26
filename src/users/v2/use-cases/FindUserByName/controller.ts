import { Controller, Get, Query } from '@nestjs/common';
import { FindUserByNameService } from './service';
import { FindUserByNameDto } from './dto';

@Controller('v2/users')
export class FindUserByNameController {
    constructor(private readonly findUserByNameService: FindUserByNameService) {}

    @Get('find-by-name')
    async findByName(@Query() query: FindUserByNameDto) {
        return this.findUserByNameService.handle(query.name);
    }
}
