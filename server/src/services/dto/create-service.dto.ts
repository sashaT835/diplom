import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional, Min } from "class-validator";

export class CreateServiceDto {
  @ApiProperty({ example: "Установка 1С", description: "Название услуги" })
  @IsString()
  name: string;

  @ApiProperty({ example: 45000, description: "Цена услуги" })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: "Проводим полную установку 1С на вашем сервере",
    description: "Описание услуги",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
