import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CartService } from "./cart.service";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { UpdateQuantityDto } from "./dto/update-quantity.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { NonAdminGuard } from "../auth/guards/non-admin.guard";

@ApiTags("cart")
@ApiBearerAuth("access-token")
@Controller("cart")
@UseGuards(JwtAuthGuard, NonAdminGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "Получить корзину текущего пользователя" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Содержимое корзины",
    schema: {
      example: [
        {
          id: 1,
          productId: 3,
          quantity: 2,
          product: { id: 3, name: "1С Бухгалтерия", price: 4400, image: "/img/1c-accounting.jpg" },
        },
      ],
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Не авторизован" })
  async getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: "Добавить товар в корзину" })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Товар добавлен в корзину",
    schema: {
      example: {
        id: 1,
        userId: 2,
        productId: 3,
        quantity: 1,
        createdAt: "2026-01-09T16:25:29.000Z",
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Не авторизован" })
  async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Обновить количество товара в корзине" })
  @ApiParam({ name: "id", description: "ID записи в корзине", example: 1 })
  @ApiBody({ type: UpdateQuantityDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Количество обновлено",
    schema: {
      example: {
        id: 1,
        userId: 2,
        productId: 3,
        quantity: 3,
        createdAt: "2026-01-09T16:25:29.000Z",
      },
    },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Не авторизован" })
  async updateQuantity(
    @Request() req,
    @Param("id") id: string,
    @Body() updateQuantityDto: UpdateQuantityDto
  ) {
    return this.cartService.updateQuantity(
      req.user.id,
      +id,
      updateQuantityDto.quantity
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "Удалить товар из корзины" })
  @ApiParam({ name: "id", description: "ID записи в корзине", example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Товар удалён из корзины",
    schema: { example: { id: 1, userId: 2, productId: 3, quantity: 1 } },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Не авторизован" })
  async removeFromCart(@Request() req, @Param("id") id: string) {
    return this.cartService.removeFromCart(req.user.id, +id);
  }

  @Delete()
  @ApiOperation({ summary: "Очистить корзину" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Корзина очищена",
    schema: { example: { count: 3 } },
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Не авторизован" })
  async clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
