import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://i-exist.twiling.ru'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    app.use(cookieParser());
    app.useGlobalInterceptors();
    app.enableShutdownHooks();

    const config = new DocumentBuilder()
        .setTitle('I Exist API')
        .setDescription('The I Exist API description')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
        )
        // .addApiKey(
        //     {
        //         // <--- Покажет опцию X-API-KEY (apiKey)
        //         type: 'apiKey', // в окне 'Available authorizations' в Swagger
        //         name: 'X-API-KEY',
        //         in: 'header',
        //         description: 'Enter your API key',
        //     },
        //     'X-API-KEY',
        // )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3003);
}
bootstrap();
