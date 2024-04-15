import { Injectable } from '@nestjs/common';
import * as FS from 'fs';
import { FileConstants } from './file.constants';
import { CustomLogger } from '../log/custom.logger';
import { ImageExtensionEnum } from './enum/ImageExtensionEnum';
import { ImageOwnerTypeEnum } from './enum/image-owner-type.enum';

@Injectable()
export class FileService {
    private readonly logger = CustomLogger.getLogger(FileService.name);

    processUploadedImage(
        ownerType: string,
        imageType: string,
        ownerId: string,
        currentPath: string,
        fileExtension: string,
    ): string {
        this.removePreviousImage(ownerType, imageType, ownerId);
        const newName = `${ownerId}.${fileExtension}`;
        let newPath = `${FileConstants.baseImgDir}${ownerType}/${imageType}/${newName}`;
        if (ownerType === ImageOwnerTypeEnum.TICKET.toString()) {
            newPath = `${FileConstants.baseImgDir}${ownerType}/${newName}`;
        }
        console.log(currentPath);
        console.log(newPath);
        FS.copyFileSync(currentPath, newPath);
        FS.rmSync(currentPath);
        return newPath;
    }

    createDirTree(): void {
        Object.values(FileConstants.imgDirectories).forEach((dir: string) => {
            const path = `${FileConstants.baseImgDir}${dir}`;
            this.createIdDoesntExists(path);
            Object.values(FileConstants.imgSubDirectories).forEach((subDir: string) =>
                this.createIdDoesntExists(`${path}${subDir}`),
            );
        });
    }

    private createIdDoesntExists(path: string) {
        if (!FS.existsSync(path)) {
            this.logger.info(`directory: "${path}" - CREATED`);
            FS.mkdirSync(path);
        }
    }

    private removePreviousImage(ownerType: string, imageType: string, ownerId: string) {
        Object.values(ImageExtensionEnum).forEach((ext) => {
            const path = `${FileConstants.baseImgDir}${ownerType}/${imageType}/${ownerId}.${ext}`;
            try {
                FS.rmSync(path);
                this.logger.info(`previous image removed: ${path}`);
            } catch (error) {
                this.logger.debug(`no image found with extension: ${ext}`);
            }
        });
    }
}
