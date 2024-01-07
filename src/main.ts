import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    app.use(cookieParser());
    app.useGlobalInterceptors();
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
