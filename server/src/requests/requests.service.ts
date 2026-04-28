import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { CreateRequestDto } from "./dto/create-request.dto";
import { RealtimeGateway } from "../realtime/realtime.gateway";
import { RealtimeTopics } from "../realtime/realtime-topics";

@Injectable()
export class RequestsService {
  constructor(private readonly realtimeGateway: RealtimeGateway) {}

  private readonly logger = new Logger(RequestsService.name);
  private readonly vkToken = process.env.VK_TOKEN;
  private readonly apiVersion = process.env.VK_API_VERSION || "5.131";

  async sendRequest(createRequestDto: CreateRequestDto) {

    if (!this.vkToken) {

      this.logger.warn("VK Token not configured. Skipping VK notification.");

      return { success: false, message: "VK Token не настроен" };

    }

    try {

      const message = this.formatMessage(createRequestDto);

      const peers = await this.getAllPeers();

      if (peers.length === 0) {
        this.logger.warn("No active conversations found to send message.");
        return { success: false, message: "Список диалогов пуст" };
      }

      this.logger.log(`Starting broadcast to ${peers.length} peers...`);

      for (const peerId of peers) {
        await this.sendMessage(peerId, message);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      const eventPayload = {
        serviceName: createRequestDto.serviceName,
        name: createRequestDto.name,
        phone: createRequestDto.phone,
        email: createRequestDto.email ?? null,
        comment: createRequestDto.comment ?? null,
        sentToPeers: peers.length,
        createdAt: new Date().toISOString(),
      };

      this.realtimeGateway.emitToAdmins(
        RealtimeTopics.REQUEST_CREATED,
        eventPayload
      );
      this.realtimeGateway.emitToAdmins(RealtimeTopics.ANALYTICS_UPDATED, {
        source: "requests",
        createdAt: eventPayload.createdAt,
      });

      return {
        success: true,
        message: `Заявка успешно разослана в ${peers.length} чат(ов)`,
      };

    } catch (error) {
      this.logger.error("Failed to process VK broadcast", error);
      throw error;
    }
  }
  /**
   * Получает ID всех последних собеседников
   */
  private async getAllPeers(): Promise<number[]> {

    try {
      const response = await axios.get("https://api.vk.com/method/messages.getConversations", {
        params: {
          access_token: this.vkToken,
          v: this.apiVersion,
          count: 200,
        },
      });

      if (response.data.error) {
        throw new Error(`VK API Error: ${response.data.error.error_msg}`);

      }

      return response.data.response.items.map((item: any) => item.conversation.peer.id);
    } catch (error) {
      this.logger.error("Error fetching conversations", error);
      return [];
    }
  }

  /**
   * Отправка сообщения конкретному peer_id
   */
  private async sendMessage(peerId: number, message: string) {

    try {
      await axios.post("https://api.vk.com/method/messages.send", null, {
        params: {
          access_token: this.vkToken,
          peer_id: peerId,
          message,
          random_id: Math.floor(Math.random() * 1000000), // Более надежный random_id
          v: this.apiVersion,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to send message to peer ${peerId}`, error.message);
    }
  }

  private formatMessage(data: CreateRequestDto): string {
    let message = `🔔 Новая заявка\n\n`;
    message += `Обращение: ${data.serviceName}\n`;
    message += `Имя: ${data.name}\n`;
    message += `Телефон: ${data.phone}\n`;
    if (data.email) message += `Email: ${data.email}\n`;
    if (data.comment) message += `\nКомментарий:\n${data.comment}`;

    return message;
  }
}
