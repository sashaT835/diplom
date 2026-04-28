import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  // Создать новое сообщение
  async create(senderId: number, createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        senderId,
        receiverId: createMessageDto.receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }

  // Получить все сообщения между двумя пользователями
  async getConversation(userId1: number, userId2: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  // Получить список чатов для админа (все уникальные пользователи с сообщениями)
  async getAdminChats(adminId: number) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: adminId }, { receiverId: adminId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Группируем сообщения по пользователям
    const chatsMap = new Map();

    for (const message of messages) {
      const otherUser =
        message.senderId === adminId ? message.receiver : message.sender;

      if (!chatsMap.has(otherUser.id)) {
        const unreadCount = await this.prisma.message.count({
          where: {
            senderId: otherUser.id,
            receiverId: adminId,
            isRead: false,
          },
        });

        chatsMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: message,
          unreadCount,
        });
      }
    }

    return Array.from(chatsMap.values());
  }

  // Получить чат пользователя с админом
  async getUserChat(userId: number) {
    // Найти админа
    const admin = await this.prisma.user.findFirst({
      where: { role: "admin" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!admin) {
      throw new Error("Admin not found");
    }

    const messages = await this.getConversation(userId, admin.id);

    const unreadCount = await this.prisma.message.count({
      where: {
        senderId: admin.id,
        receiverId: userId,
        isRead: false,
      },
    });

    return {
      admin,
      messages,
      unreadCount,
    };
  }

  // Отметить сообщения как прочитанные
  async markAsRead(userId: number, otherUserId: number) {
    return this.prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  // Получить количество непрочитанных сообщений
  async getUnreadCount(userId: number) {
    return this.prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }
}
