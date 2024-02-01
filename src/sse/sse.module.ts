import { Module } from '@nestjs/common';
import { SseService } from './sse.service';
import { SseController } from './sse.controller';

@Module({
    providers: [SseService],
    exports: [SseService], // Экспортируем SseService, чтобы его можно было использовать в других модулях
    controllers: [SseController],
})
export class SseModule {}
