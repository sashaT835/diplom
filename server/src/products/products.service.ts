import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  private readonly baseUrl = process.env.BASE_URL || "http://localhost:3001";

  constructor(private prisma: PrismaService) {}

  private formatProductWithImageUrl(product: any) {
    if (!product.image) {
      return { ...product, image: null };
    }
    // Don't add baseUrl if image already contains the full URL
    const image =
      product.image.startsWith("http://") ||
      product.image.startsWith("https://") ||
      product.image.includes(this.baseUrl)
        ? product.image
        : `${this.baseUrl}${product.image}`;
    return {
      ...product,
      image,
    };
  }

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });
    return this.formatProductWithImageUrl(product);
  }

  async findAll(category?: string) {
    const where = category ? { category } : {};
    const products = await this.prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return products.map((product) => this.formatProductWithImageUrl(product));
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.formatProductWithImageUrl(product);
  }

  private cleanImageUrl(imageUrl: string): string {
    if (!imageUrl) return imageUrl;

    // If it's already a full URL, extract the path part
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      // Extract path from full URL
      try {
        const url = new URL(imageUrl);
        return url.pathname;
      } catch {
        return imageUrl;
      }
    }

    return imageUrl;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Check if exists
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Clean image URL to prevent duplication
    const cleanedData = {
      ...updateProductDto,
      image: updateProductDto.image
        ? this.cleanImageUrl(updateProductDto.image)
        : updateProductDto.image,
    };

    const product = await this.prisma.product.update({
      where: { id },
      data: cleanedData,
    });
    return this.formatProductWithImageUrl(product);
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists
    return this.prisma.product.delete({
      where: { id },
    });
  }

  // ============ АНАЛИТИКА ============

  /**
   * Инкрементировать счётчик просмотров товара
   */
  async incrementViewCount(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
    return this.formatProductWithImageUrl(updated);
  }

  /**
   * Записать покупку (вызывать при оформлении заказа)
   */
  async recordPurchase(
    productId: number,
    userId: number | null,
    quantity: number,
    totalPrice: number,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Создать запись о покупке
    const purchase = await this.prisma.purchase.create({
      data: {
        productId,
        userId,
        quantity,
        totalPrice,
      },
    });

    // Увеличить purchaseCount на количество
    await this.prisma.product.update({
      where: { id: productId },
      data: { purchaseCount: { increment: quantity } },
    });

    return purchase;
  }

  /**
   * Записать покупки из корзины (при оформлении заказа)
   */
  async recordPurchasesFromCart(userId: number) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return { message: "Корзина пуста", purchases: [] };
    }

    const purchases = [];
    for (const item of cartItems) {
      const purchase = await this.recordPurchase(
        item.productId,
        userId,
        item.quantity,
        item.product.price * item.quantity,
      );
      purchases.push(purchase);
    }

    return { message: "Покупки записаны", purchases };
  }

  /**
   * Получить топ популярных товаров по покупкам
   */
  async getPopularProducts(limit: number = 10) {
    const products = await this.prisma.product.findMany({
      orderBy: { purchaseCount: "desc" },
      take: limit,
    });
    return products.map((p) => this.formatProductWithImageUrl(p));
  }

  /**
   * Получить статистику одного товара
   */
  async getProductStats(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        _count: { select: { purchases: true } },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Получить последние покупки
    const recentPurchases = await this.prisma.purchase.findMany({
      where: { productId: id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });

    return {
      product: this.formatProductWithImageUrl(product),
      viewCount: product.viewCount,
      purchaseCount: product.purchaseCount,
      totalPurchaseRecords: product._count.purchases,
      recentPurchases,
    };
  }

  /**
   * Общая аналитика для админки: все товары с просмотрами и покупками
   */
  async getAnalytics() {
    const products = await this.prisma.product.findMany({
      orderBy: { purchaseCount: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        image: true,
        viewCount: true,
        purchaseCount: true,
      },
    });

    const totalViews = products.reduce((sum, p) => sum + p.viewCount, 0);
    const totalPurchases = products.reduce((sum, p) => sum + p.purchaseCount, 0);

    // Статистика покупок за последние 30 дней по дням
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyPurchases = await this.prisma.purchase.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _sum: { quantity: true, totalPrice: true },
      _count: true,
    });

    // Группируем по дням
    const salesByDay: Record<string, { count: number; quantity: number; revenue: number }> = {};
    for (const p of dailyPurchases) {
      const day = p.createdAt.toISOString().split("T")[0];
      if (!salesByDay[day]) {
        salesByDay[day] = { count: 0, quantity: 0, revenue: 0 };
      }
      salesByDay[day].count += p._count;
      salesByDay[day].quantity += p._sum.quantity || 0;
      salesByDay[day].revenue += p._sum.totalPrice || 0;
    }

    // Преобразуем в массив и сортируем по дате
    const salesTimeline = Object.entries(salesByDay)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Топ-5 по покупкам
    const topByPurchases = [...products]
      .sort((a, b) => b.purchaseCount - a.purchaseCount)
      .slice(0, 5)
      .map((p) => this.formatProductWithImageUrl(p));

    // Топ-5 по просмотрам
    const topByViews = [...products]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map((p) => this.formatProductWithImageUrl(p));

    return {
      totalProducts: products.length,
      totalViews,
      totalPurchases,
      topByPurchases,
      topByViews,
      salesTimeline,
      products: products.map((p) => this.formatProductWithImageUrl(p)),
    };
  }
}
