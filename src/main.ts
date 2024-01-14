import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    app.enableCors();
    app.use(cookieParser());
    app.useGlobalInterceptors();
    app.enableShutdownHooks();

    const config = new DocumentBuilder()
        .setTitle('Alive example')
        .setDescription('The Alive API description')
        .setVersion('1.0')
        .addTag('alive')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3003);
}
bootstrap();
