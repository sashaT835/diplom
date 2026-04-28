import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: { select: { purchases: true } },
      },
    });
    return users.map((u) => ({
      ...u,
      purchaseCount: u._count.purchases,
      _count: undefined,
    }));
  }

  async changeUserRole(targetUserId: number, role: string, currentUserId: number) {
    if (targetUserId === currentUserId) {
      throw new ForbiddenException("Нельзя изменить свою роль");
    }
    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }
    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { role },
    });
    const { password, ...result } = updated;
    return result;
  }

  async getUserPurchases(targetUserId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }
    const purchases = await this.prisma.purchase.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { id: true, name: true, image: true, price: true } },
      },
    });
    return purchases;
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }

    const { password, ...result } = user;
    return result;
  }

  async updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    const { password, birthDate, ...restData } = updateUserDto;

    const updateData: any = { ...restData };

    // Если меняется пароль, хешируем его
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Преобразуем дату рождения, если она есть
    if (birthDate) {
      updateData.birthDate = new Date(birthDate);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { password: _, ...result } = updatedUser;
    return result;
  }
}
