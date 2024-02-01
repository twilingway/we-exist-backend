import { Controller, Sse, MessageEvent, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '@auth/guargs/role.guard';
import { Public, Roles } from '@common/decorators';

@Controller('events')
export class SseController {
    constructor(private readonly sseService: SseService) {}

    // @Roles('ADMIN' || 'MANAGER')
    // @UseGuards(RolesGuard)
    // @ApiBearerAuth('JWT-auth')
    @Public()
    @Sse('subscribe')
    subscribe(): Observable<MessageEvent> {
        return new Observable((subscriber) => {
            const client = (data: any) => subscriber.next({ data });

            this.sseService.addClient(client);

            return () => this.sseService.removeClient(client);
        });
    }
}
