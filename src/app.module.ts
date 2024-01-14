import { JwtAuthGuard } from '@auth/guargs/jwt-auth.guard';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { PrismaService } from './prisma/prisma.service';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import AdminJS from 'adminjs';
import { AdminModule } from '@adminjs/nestjs';
import { ResourceWithOptions, ResourceOptions } from 'adminjs/types/src';
import { PrismaClient, User } from '@prisma/client';
import { UserResponse } from '@user/responses';

const prisma = new PrismaClient();

const DEFAULT_ADMIN = {
    email: 'admin@example.com',
    password: 'password',
};

const authenticate = async (email: string, password: string) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN);
    }
    return null;
};

AdminJS.registerAdapter({ Database, Resource });

// const admin = new AdminJS({
//     resources: [
//         UserResponse, // you can simply pass a model
//     ],
// });

@Module({
    imports: [
        UserModule,
        PrismaModule,
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true }),
        OrderModule,
        AdminModule.createAdminAsync({
            useFactory: async () => {
                // const dmmf = (prisma as any)._dmmf as any;

                return {
                    adminJsOptions: {
                        rootPath: '/admin',
                        // updated here
                        resources: [
                            {
                                resource: { model: getModelByName('User'), client: prisma },
                                options: {},
                            },
                        ],
                    },
                    // auth: {
                    //     authenticate,
                    //     cookieName: 'adminjs',
                    //     cookiePassword: 'secret',
                    // },
                    // sessionOptions: {
                    //     resave: true,
                    //     saveUninitialized: true,
                    //     secret: 'secret',
                    // },
                };
            },
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
