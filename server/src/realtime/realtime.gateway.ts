import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import {Injectable, Logger} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Server, Socket} from "socket.io";
import {PrismaService} from "../prisma/prisma.service";
import {RealtimeTopic} from "./realtime-topics";

@Injectable()
@WebSocketGateway({
    cors: {
        origin: [
            "http://localhost:5173",
            "http://localhost",
            "http://localhost:80",
            "http://186.246.3.13",
            "http://186.246.3.13:80",
        ],
        credentials: true,
    },
})
export class RealtimeGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(RealtimeGateway.name);

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
    ) {
    }

    async handleConnection(client: Socket): Promise<void> {
        const token = this.extractToken(client);
        if (!token) {
            client.disconnect();
            return;
        }

        try {
            const payload = await this.jwtService.verifyAsync<{ sub: number }>(token, {
                secret: process.env.JWT_SECRET,
            });

            const user = await this.prisma.user.findUnique({
                where: {id: payload.sub},
                select: {id: true, role: true},
            });

            if (!user) {
                client.disconnect();
                return;
            }

            client.data.userId = user.id;
            client.data.role = user.role;
            client.join(this.getUserRoom(user.id));

            if (user.role === "admin") {
                client.join("role:admin");
            }

            this.logger.log(`Realtime client connected: user=${user.id}`);
        } catch (error) {
            this.logger.warn(`Realtime auth failed: ${error.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket): void {
        if (client.data?.userId) {
            this.logger.log(`Realtime client disconnected: user=${client.data.userId}`);
        }
    }

    emitToUser(userId: number, topic: RealtimeTopic, data: unknown): void {
        this.server.to(this.getUserRoom(userId)).emit("topic", {topic, data});
    }

    emitToAdmins(topic: RealtimeTopic, data: unknown): void {
        this.server.to("role:admin").emit("topic", {topic, data});
    }

    emitToMany(userIds: number[], topic: RealtimeTopic, data: unknown): void {
        for (const userId of userIds) {
            this.emitToUser(userId, topic, data);
        }
    }

    private getUserRoom(userId: number): string {
        return `user:${userId}`;
    }

    private extractToken(client: Socket): string | null {
        const authToken = client.handshake.auth?.token;
        if (typeof authToken === "string" && authToken.length > 0) {
            return authToken;
        }

        const queryToken = client.handshake.query?.token;
        if (typeof queryToken === "string" && queryToken.length > 0) {
            return queryToken;
        }

        const authHeader = client.handshake.headers.authorization;
        if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
            return authHeader.slice(7);
        }

        return null;
    }
}
