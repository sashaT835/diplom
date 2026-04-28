import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { VK } from "vk-io";
import { CreateRequestDto } from "./dto/create-request.dto";

@Injectable()
export class RequestsService implements OnModuleInit {
  private readonly logger = new Logger(RequestsService.name);
  private vk: VK;

  onModuleInit() {
    this.vk = new VK({
      token: process.env.VK_TOKEN,
      apiVersion: "5.131",
      apiLimit: 20,
    });
  }


  async sendRequest(createRequestDto: CreateRequestDto) {
    if (!process.env.VK_TOKEN) {
      this.logger.warn("VK Token not configured.");
      return { success: false, message: "VK Token не настроен" };
    }

    try {
      const message = this.formatMessage(createRequestDto);

      const { items } = await this.vk.api.messages.getConversations({
        count: 200,
      });

      if (items.length === 0) {
        return { success: false, message: "Нет активных диалогов" };
      }

      const sendPromises = items.map((item) => {
        const peerId = item.conversation.peer.id;
        return this.vk.api.messages.send({
          peer_id: peerId,
          message: message,
          random_id: Math.random() * 10000,
        }).catch(err => {
          this.logger.error(`Ошибка отправки для peer ${peerId}: ${err.message}`);
        });
      });

      await Promise.all(sendPromises);

      this.logger.log(`Broadcast sent to ${items.length} peers.`);
      return { success: true, message: "Рассылка завершена" };

    } catch (error) {
      this.logger.error("VK Broadcast failed", error);
      throw error;
    }
  }

  private formatMessage(data: CreateRequestDto): string {
    return [
      `🔔 Новая заявка на услугу`,
      `Услуга: ${data.serviceName}`,
      `Имя: ${data.name}`,
      `Телефон: ${data.phone}`,
      data.email ? `Email: ${data.email}` : "",
      data.comment ? `\nКомментарий:\n${data.comment}` : ""
    ].filter(Boolean).join("\n");
  }
}
