import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AddToCartDto } from "./dto/add-to-cart.dto";

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: number) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    return {
      items: cartItems,
      total,
      count: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  async addToCart(userId: number, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Проверяем существование товара
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Товар не найден");
    }

    // Проверяем, есть ли уже этот товар в корзине
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      // Увеличиваем количество
      return await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: true,
        },
      });
    } else {
      // Создаем новую запись
      return await this.prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: {
          product: true,
        },
      });
    }
  }

  async updateQuantity(userId: number, itemId: number, quantity: number) {
    // Проверяем, принадлежит ли товар этому пользователю
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId,
      },
    });

    if (!cartItem) {
      throw new Error("Товар в корзине не найден");
    }

    if (quantity <= 0) {
      // Удаляем товар если количество 0
      await this.prisma.cartItem.delete({
        where: { id: itemId },
      });
      return null;
    }

    return await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: true,
      },
    });
  }

  async removeFromCart(userId: number, itemId: number) {
    // Проверяем, принадлежит ли товар этому пользователю
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId,
      },
    });

    if (!cartItem) {
      throw new Error("Товар в корзине не найден");
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { message: "Товар удален из корзины" };
  }

  async clearCart(userId: number) {
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return { message: "Корзина очищена" };
  }
}
