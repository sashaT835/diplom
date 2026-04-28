import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Product {
  @ApiProperty({
    description: "ID товара",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "Название товара",
    example: "1С Бухгалтерия",
  })
  name: string;

  @ApiProperty({
    description: "Цена товара в рублях",
    example: 4400,
  })
  price: number;

  @ApiProperty({
    description: "URL изображения товара",
    example: "/img/1c-accounting.jpg",
  })
  image: string;

  @ApiPropertyOptional({
    description: "Описание товара",
    example: "Полный контроль финансовой деятельности компании",
  })
  description?: string;

  @ApiPropertyOptional({
    description: "Категория товара",
    example: "Программное обеспечение",
  })
  category?: string;

  @ApiProperty({
    description: "Варианты товара",
    example: ["Базовая", "ПРОФ", "КРОП"],
    type: [String],
  })
  variants: string[];

  @ApiProperty({
    description: "Преимущества товара",
    example: [
      "Строгое соответствие законодательству",
      "Подходит юрлицам на УСН, ПСН, ОСНО",
    ],
    type: [String],
  })
  benefits: string[];

  @ApiProperty({
    description: "Функциональные возможности",
    example: ["Учет и отчетность", "Управление финансовыми ресурсами"],
    type: [String],
  })
  features: string[];

  @ApiProperty({
    description: "Дата создания",
    example: "2026-01-09T16:25:29.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Дата обновления",
    example: "2026-01-09T16:25:29.000Z",
  })
  updatedAt: Date;
}
