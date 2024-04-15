import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Address, City, State } from '@prisma/client';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { CustomLogger } from '../log/custom.logger';

@Injectable()
export class AddressRepository {
    private readonly logger = CustomLogger.getLogger(AddressRepository.name);

    constructor(private readonly prisma: PrismaService) {}

    list(skip: number, take: number): Promise<Address[]> {
        return this.prisma.address.findMany({
            skip,
            take,
        });
    }

    count(): Promise<number> {
        return this.prisma.address.count({});
    }

    findById(id: string): Promise<Address> {
        const address = this.prisma.address.findUnique({
            where: {
                id,
            },
            include: {
                city: {
                    include: {
                        state: true,
                    },
                },
            },
        });

        if (!address) {
            this.logger.error(`no address found for id ${id}`);
            return null;
        }

        return address;
    }

    create(createAddressDto: CreateAddressDto): Promise<Address> {
        const persistedUser = this.prisma.address.create({
            data: {
                ...createAddressDto,
            },
        });

        if (!persistedUser) {
            this.logger.error('error persisting user');
            return null;
        }

        return persistedUser;
    }

    update(id: string, updateAddressDto: UpdateAddressDto): Promise<Address> {
        const updatedAddress = this.prisma.address.update({
            where: { id },
            data: {
                ...updateAddressDto,
            },
        });

        if (!updatedAddress) {
            this.logger.error(`error updating address ${id}`);
            return null;
        }

        return updatedAddress;
    }

    remove(id: string): Promise<Address> {
        const deletedAddress = this.prisma.address.delete({
            where: { id },
        });

        if (!deletedAddress) {
            this.logger.error(`error deleting address: ${id}`);
            return null;
        }

        return deletedAddress;
    }

    findStateById(id: string): Promise<State> {
        return this.prisma.state.findUnique({ where: { id } });
    }

    findCityById(id: string): Promise<City> {
        return this.prisma.city.findUnique({
            where: { id },
            include: { state: true },
        });
    }

    listStates(): Promise<any> {
        return this.prisma.state.findMany();
    }

    listCities(stateId: string): Promise<any> {
        return this.prisma.city.findMany({
            where: { stateId },
            include: { state: true },
        });
    }
}
