import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    ParseFilePipe,
    ParseFilePipeBuilder,
    Post,
    Query,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { ImageTypeEnum } from './enum/image-type.enum';
import { ImageOwnerTypeEnum } from './enum/image-owner-type.enum';
import { FileConstants } from './file.constants';
import { CustomLogger } from '../log/custom.logger';
import { ApiTags } from '@nestjs/swagger';
import * as FS from 'fs';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ImageExtensionEnum } from './enum/ImageExtensionEnum';
import { UsersService } from '../users/users.service';
import { EventService } from '../event/event.service';
import { SpeakerService } from '../speaker/speaker.service';
import { SupporterService } from '../supporter/supporter.service';
import { SponsorService } from '../sponsor/sponsor.service';
import { HighlightCardService } from 'src/highligh-card/highlight-card-service';

@ApiTags('Files')
@Controller('files')
export class FileController {
    private readonly logger = CustomLogger.getLogger(FileController.name);

    private static readonly IMAGE_MAX_SIZE: number = 1024 * 10000; // TODO - from env
    private typeValidationErrors: any[];

    constructor(
        private readonly fileService: FileService,
        private readonly userService: UsersService,
        private readonly eventService: EventService,
        private readonly speakerService: SpeakerService,
        private readonly supporterService: SupporterService,
        private readonly sponsorService: SponsorService,
        private readonly cardService: HighlightCardService,
    ) {
        this.fileService.createDirTree();
    }

    @Get('/image')
    async getImageByPath(@Query('path') imagePath: string, @Res() response: Response): Promise<any> {
        // Validando o caminho para evitar caracteres indesejados
        if (!/^[\w\-\/]+\.(jpeg|jpg|png|gif)$/.test(imagePath)) {
            throw new HttpException('Invalid path', HttpStatus.BAD_REQUEST);
        }

        const absolutePath = join(process.cwd(), '/files/images', imagePath);

        // Verificando se o caminho está realmente dentro da pasta de imagens
        if (!absolutePath.startsWith(join(process.cwd(), '/files/images')) || !FS.existsSync(absolutePath)) {
            throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
        }

        // Definindo o tipo de conteúdo dinamicamente (apenas um exemplo, você pode estender isso)
        let contentType = 'image/jpeg';
        if (imagePath.endsWith('.png')) {
            contentType = 'image/png';
        } else if (imagePath.endsWith('.gif')) {
            contentType = 'image/gif';
        }
        response.setHeader('Content-Type', contentType);

        const fileStream = createReadStream(absolutePath);
        fileStream.pipe(response);
    }

    @Post('/image')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: FileController.getStorageEngine(),
        }),
    )
    async uploadImage(
        @UploadedFile(FileController.getFileValidator())
        image: Express.Multer.File,
        @Body('img-type') imgType: ImageTypeEnum,
        @Body('owner-type') ownerType: ImageOwnerTypeEnum,
        @Body('owner-id') ownerId: string,
        @Res() response: Response,
    ): Promise<Response> {
        const extension = this.getExtension(image.originalname);
        this.validateTypes(imgType, ownerType, extension);
        if (this.typeValidationErrors.length > 0) {
            return response.status(HttpStatus.BAD_REQUEST).json(this.typeValidationErrors);
        }

        const imgPath = this.fileService.processUploadedImage(
            ownerType,
            imgType,
            ownerId,
            `${FileConstants.tempImgDir}${image.filename}`,
            extension,
        );

        const imageUrl = `/${ownerType}/${imgType}/${ownerId}.${extension}`;

        this.logger.info(`image successfully uploaded to: ${imgPath}`);
        await this.updateOwnerEntity(ownerId, ownerType, imgType, imgPath, imageUrl);

        return response.status(HttpStatus.ACCEPTED).json({
            message: 'upload successful',
            path: imgPath,
            img_url: imageUrl,
        });
    }

    private getExtension(fileName: string): string {
        const separatorIndex = fileName.lastIndexOf('.') + 1;
        return fileName.substring(separatorIndex);
    }

    private async updateOwnerEntity(
        ownerId: string,
        imgOwnerType: ImageOwnerTypeEnum,
        imgType: ImageTypeEnum,
        imgPath: string,
        imgUrl: string,
    ) {
        switch (imgOwnerType) {
            case ImageOwnerTypeEnum.USER.toString():
                imgType === ImageTypeEnum.FULL_SIZE
                    ? await this.userService.updateImageUrl(ownerId, imgPath, imgUrl, null)
                    : await this.userService.updateImageUrl(ownerId, imgPath, null, imgUrl);
                break;
            case ImageOwnerTypeEnum.EVENT.toString():
                imgType === ImageTypeEnum.FULL_SIZE
                    ? await this.eventService.updateImageUrl(ownerId, imgPath, imgUrl, null)
                    : await this.eventService.updateImageUrl(ownerId, imgPath, null, imgUrl);
                break;
            case ImageOwnerTypeEnum.SPEAKER.toString():
                imgType === ImageTypeEnum.FULL_SIZE
                    ? await this.speakerService.updateImageUrl(ownerId, imgPath, imgUrl, null)
                    : await this.speakerService.updateImageUrl(ownerId, imgPath, null, imgUrl);
                break;
            case ImageOwnerTypeEnum.SUPPORTER.toString():
                imgType === ImageTypeEnum.FULL_SIZE
                    ? await this.supporterService.updateImageUrl(ownerId, imgPath, imgUrl, null)
                    : await this.supporterService.updateImageUrl(ownerId, imgPath, null, imgUrl);
                break;
            case ImageOwnerTypeEnum.SPONSORS.toString():
                imgType === ImageTypeEnum.FULL_SIZE
                    ? await this.sponsorService.updateImageUrl(ownerId, imgPath, imgUrl, null)
                    : await this.sponsorService.updateImageUrl(ownerId, imgPath, null, imgUrl);
                break;
            case ImageOwnerTypeEnum.CARD.toString():
                imgType === ImageTypeEnum.FULL_SIZE
                    ? await this.cardService.updateImageUrl(ownerId, imgPath, imgUrl, null)
                    : await this.cardService.updateImageUrl(ownerId, imgPath, null, imgUrl);
                break;
            case ImageOwnerTypeEnum.TICKET.toString():
                await this.eventService.updateTicketImageUrl(ownerId, imgPath);
                break;
            default:
                this.logger.error('tipo de entidade desconecido');
        }
    }

    private validateTypes(imgType: ImageTypeEnum, ownerType: ImageOwnerTypeEnum, fileExtension?: string): void {
        this.typeValidationErrors = [];
        if (!Object.values(ImageTypeEnum).includes(imgType)) {
            this.typeValidationErrors.push({
                message: 'invalid image type',
                validTypes: Object.values(ImageTypeEnum),
            });
        }
        if (!Object.values(ImageOwnerTypeEnum).includes(ownerType)) {
            this.typeValidationErrors.push({
                message: 'invalid image owner type',
                validTypes: Object.values(ImageOwnerTypeEnum),
            });
        }
        if (fileExtension && !Object.keys(ImageExtensionEnum).includes(fileExtension.toUpperCase())) {
            this.typeValidationErrors.push({
                message: 'invalid image extensions',
                validExtensions: Object.keys(ImageExtensionEnum),
            });
        }
    }

    private static getFileValidator(): ParseFilePipe {
        return new ParseFilePipeBuilder()
            .addMaxSizeValidator({
                maxSize: FileController.IMAGE_MAX_SIZE,
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            });
    }

    private static getStorageEngine(): multer.StorageEngine {
        return diskStorage({
            destination: FileConstants.tempImgDir,
        });
    }
}
