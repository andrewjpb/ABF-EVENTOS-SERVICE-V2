import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressRepository } from './address.repository';
import { Result } from '../../shared/result/result.model';
import { PersistenceError } from '../../shared/errors/persistence.error';
import { AddressConstants } from './address.constants';
import { EntityNotFoundError } from '../../shared/errors/entity-not-found.error';
import { CustomLogger } from '../log/custom.logger';
import { City, State } from '@prisma/client';

@Injectable()
export class AddressService {
    private readonly logger = CustomLogger.getLogger(AddressService.name);

    constructor(private readonly addressRepo: AddressRepository) {}

    async create(createAddressDto: CreateAddressDto): Promise<Result> {
        const persistedAddress = await this.addressRepo.create(createAddressDto);

        if (!persistedAddress) {
            this.logger.error('error persisting address');
            return new Result(
                AddressConstants.errors.persistenceError,
                null,
                new PersistenceError(AddressConstants.errors.persistenceError),
            );
        }

        this.logger.info(`address successfully created, id: ${persistedAddress.id}`);
        return new Result(AddressConstants.messages.creationSuccess, persistedAddress, null);
    }

    async findAll(skip: number, take: number): Promise<Result> {
        const addresses = await this.addressRepo.list(skip, take);
        this.logger.info(`addresses found: ${addresses.length}`);
        if (!addresses) {
            this.logger.error(AddressConstants.errors.notFoundError);
            return new Result(
                AddressConstants.errors.notFoundError,
                addresses,
                new EntityNotFoundError(AddressConstants.errors.notFoundError),
            );
        }
        return new Result(AddressConstants.messages.listingSuccess, addresses, null);
    }

    async count(): Promise<number> {
        return await this.addressRepo.count();
    }

    async findOne(id: string): Promise<Result> {
        const address = await this.addressRepo.findById(id);
        if (!address) {
            this.logger.error(`address "${id}" not found`);
            return new Result(
                AddressConstants.errors.notFoundError,
                null,
                new EntityNotFoundError(AddressConstants.errors.notFoundError),
            );
        }
        return new Result(AddressConstants.messages.addressFound, address, null);
    }

    async update(id: string, updateAddressDto: UpdateAddressDto): Promise<Result> {
        const updatedAddress = await this.addressRepo.update(id, updateAddressDto);

        if (!updatedAddress) {
            this.logger.error(`error updating address: ${id}`);
            return new Result(
                AddressConstants.errors.updateError,
                null,
                new PersistenceError(AddressConstants.errors.updateError), // TODO - update error
            );
        }

        this.logger.info(`address "${id}", successfully updated`);
        return new Result(AddressConstants.messages.updateSuccess, updatedAddress, null);
    }

    async remove(id: string): Promise<Result> {
        const deletedAddress = await this.addressRepo.remove(id);
        if (!deletedAddress) {
            this.logger.error(`error deleting address: ${id}`);
            return new Result(
                AddressConstants.errors.deleteError,
                null,
                new PersistenceError(AddressConstants.errors.deleteError), // TODO - delete error
            );
        }

        this.logger.error(`address "${id}", successfully removed`);
        return new Result(AddressConstants.messages.deleteSuccess, deletedAddress, null);
    }

    async stateExists(id: string): Promise<boolean> {
        const state = await this.addressRepo.findStateById(id);
        if (!state) {
            this.logger.error(`estado não encontrado, id informado: ${id}`);
            return false;
        } else {
            this.logger.info(`estado "${state.uf}", encontrado para o id informado: "${id}"`);
            return true;
        }
    }

    async cityExists(id: string): Promise<boolean> {
        const city = await this.addressRepo.findCityById(id);
        if (!city) {
            this.logger.error(`cidade não encontrada, id informado: ${id}`);
            return false;
        } else {
            this.logger.info(`cidade "${city.name}", encontrada para o id informado: "${id}"`);
            return true;
        }
    }

    async listStates(): Promise<State[]> {
        const states = await this.addressRepo.listStates();
        this.logger.info(`encontrados ${states.length} estados`);
        return states;
    }

    async stateById(id: string): Promise<Result> {
        const state = await this.addressRepo.findStateById(id);
        if (!state) {
            const message = `uf não localizada para o id informado: ${id}`;
            this.logger.info(message);
            return new Result(message, null, new EntityNotFoundError(message));
        }

        return new Result(`localizada a uf: ${state.uf}`, state, null);
    }

    async listCities(stateId: string): Promise<City[]> {
        const cities = await this.addressRepo.listCities(stateId);
        this.logger.info(`encontradas ${cities.length} cidades para a uf informada`);
        return cities;
    }

    async cityById(id: string): Promise<Result> {
        const city = await this.addressRepo.findCityById(id);
        if (!city) {
            const message = `cidade não localizada para o id informado: ${id}`;
            this.logger.info(message);
            return new Result(message, null, new EntityNotFoundError(message));
        }

        return new Result(`localizada a cudade: ${city.name}`, city, null);
    }
}
