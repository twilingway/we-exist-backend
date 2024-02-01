import { Injectable } from '@nestjs/common';

type SseClientCallback = (data: any) => void;

@Injectable()
export class SseService {
    private clients = new Set<SseClientCallback>();

    addClient(client: SseClientCallback) {
        this.clients.add(client);
    }

    removeClient(client: SseClientCallback) {
        this.clients.delete(client);
    }

    sendToAll(message: any) {
        this.clients.forEach((client) => client(message));
    }
}
