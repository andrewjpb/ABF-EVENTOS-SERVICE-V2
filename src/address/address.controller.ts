import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Response } from 'express';
import { CustomLogger } from '../log/custom.logger';
import { PageDto } from '../../shared/dto/page.dto';
import { AuthGuard } from '../auth/auth.guard';
import { State } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Address')
@Controller('address')
export class AddressController {
    private readonly logger = CustomLogger.getLogger(AddressController.name);

    constructor(private readonly addressService: AddressService) {}

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() createAddressDto: CreateAddressDto, @Res() response: Response): Promise<Response> {
        const errors: string[] = [];
        if (!(await this.addressService.cityExists(createAddressDto.cityId))) {
            errors.push('por favor informa uma cidade válida');
        }
        if (!(await this.addressService.stateExists(createAddressDto.stateId))) {
            errors.push('por favor informa um estado válido');
        }
        if (errors.length > 0) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                errors,
            });
        }
        const persistenceResult = await this.addressService.create(createAddressDto);
        if (persistenceResult.error) {
            return this.generateErrorResponse(persistenceResult.error, response);
        }
        const persistedAddress = persistenceResult.data;
        this.logger.info(`address successfully persisted, id: "${persistedAddress.id}"`);
        return response.status(HttpStatus.CREATED).json(persistedAddress);
    }

    @UseGuards(AuthGuard)
    @Get()
    async findAll(
        @Query('offset') skip: number,
        @Query('size') take: number,
        @Res() response: Response,
    ): Promise<Response> {
        skip = skip ? skip : 0;
        take = take && take >= 100 ? take : 100;
        const listingResult = await this.addressService.findAll(skip, take);
        if (listingResult.error) {
            return this.generateErrorResponse(listingResult.error, response);
        }
        return response
            .status(HttpStatus.ACCEPTED)
            .json(new PageDto(await this.addressService.count(), listingResult.data));
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const findResult = await this.addressService.findOne(id);
        if (findResult.error) {
            return this.generateErrorResponse(findResult.error, response);
        }
        const address = findResult.data;
        this.logger.info(`address found for id: "${address.street}"`);
        return response.status(HttpStatus.ACCEPTED).json(address);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateAddressDto: UpdateAddressDto,
        @Res() response: Response,
    ): Promise<Response> {
        const updateResult = await this.addressService.update(id, updateAddressDto);
        if (updateResult.error) {
            return this.generateErrorResponse(updateResult.error, response);
        }
        const updatedAddress = updateResult.data;
        this.logger.info(`successfully updated address: ${updatedAddress.street}`);
        return response.status(HttpStatus.ACCEPTED).json(updatedAddress);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const deleteResult = await this.addressService.remove(id);
        if (deleteResult.error) {
            return this.generateErrorResponse(deleteResult.error, response);
        }
        const deletedAddress = deleteResult.data;
        this.logger.info(`successfully deleted address: ${id} - street: ${deletedAddress.street}`);
        return response.status(HttpStatus.ACCEPTED).json(deletedAddress);
    }

    private generateErrorResponse(error: Error, response: Response): Response {
        this.logger.error(error.message);
        return response.status(HttpStatus.BAD_REQUEST).json({
            message: error.message,
        });
    }

    @Get('/state/list')
    async listStates(): Promise<{ states: State[] }> {
        this.logger.info(`listando uf cadastradas...`);
        return { states: await this.addressService.listStates() };
    }

    @UseGuards(AuthGuard)
    @Get('/state/:id')
    async stateById(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const result = await this.addressService.stateById(id);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.message });
        }

        return response.status(HttpStatus.ACCEPTED).json(result.data);
    }

    @Get('/city/list/:stateId')
    async listCities(@Param('stateId') stateId: string, @Res() response: Response): Promise<Response> {
        const result = await this.addressService.stateById(stateId);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.message });
        }
        const state: State = result.data;
        this.logger.info(`listando cidades cadastradas. para a uf: ${state.uf}..`);
        return response.status(HttpStatus.ACCEPTED).json({ cities: await this.addressService.listCities(stateId) });
    }

    @UseGuards(AuthGuard)
    @Get('/city/:id')
    async cityById(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        const result = await this.addressService.cityById(id);
        if (result.error) {
            return response.status(HttpStatus.BAD_REQUEST).json({ message: result.message });
        }
        return response.status(HttpStatus.ACCEPTED).json(result.data);
    }
}
