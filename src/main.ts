import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UnauthorizedInterceptor } from 'shared/interceptors/unauthorized.interceptor';
import { EntityNotFoundInterceptor } from '../shared/interceptors/entity-not-found.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });

    const config = new DocumentBuilder()
        .setTitle('Sistema de Eventos ABF')
        .setDescription('Sistema para gerenciamento de eventos da ABF')
        .setVersion('1.0')
        .addTag('ABF Eventos')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    //Interceptors
    app.useGlobalInterceptors(new EntityNotFoundInterceptor(), new UnauthorizedInterceptor());
    await app.listen(3333);
}

bootstrap();
