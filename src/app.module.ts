import { JwtAuthGuard } from '@auth/guargs/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { SseModule } from './sse/sse.module';

@Module({
    imports: [UserModule, PrismaModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), OrderModule, SseModule],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
