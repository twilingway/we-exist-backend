import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SseModule } from 'src/sse/sse.module';

@Module({
    imports: [SseModule],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}
