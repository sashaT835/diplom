import { IsString, IsNumber, IsOptional, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProductDto {
  @ApiProperty({
    description: "Название товара",
    example: "Рулонная трава Eco Lawn",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Цена товара в рублях",
    example: 250,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: "URL изображения товара",
    example: "/img/grass-roll-1.jpg",
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    description: "Описание товара",
    example: "Высококачественная рулонная трава для вашего газона",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "Категория товара",
    example: "Рулонная трава",
  })
  @IsOptional()
  @IsString()
  category?: string;
  @ApiPropertyOptional({
    description: "Варианты товара",
    example: ["Базовая", "ПРОФ", "КРОП"],
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  variants?: string[];

  @ApiPropertyOptional({
    description: "Преимущества товара",
    example: [
      "Строгое соответствие законодательству",
      "Подходит юрлицам на УСН, ПСН, ОСНО",
    ],
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  benefits?: string[];

  @ApiPropertyOptional({
    description: "Функциональные возможности",
    example: [
      "Учет и отчетность",
      "Управление финансовыми ресурсами",
      "Работа с контрагентами",
    ],
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  features?: string[];
}
