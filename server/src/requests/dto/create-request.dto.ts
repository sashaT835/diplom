import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsOptional } from "class-validator";

export class CreateRequestDto {
  @ApiProperty({ example: "Иван Иванов", description: "Имя клиента" })
  @IsString()
  name: string;

  @ApiProperty({
    example: "+7 (999) 123-45-67",
    description: "Телефон клиента",
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: "ivan@example.com",
    description: "Email клиента",
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: "Установка 1С",
    description: "Название услуги",
  })
  @IsString()
  serviceName: string;

  @ApiProperty({
    example: "Хочу получить консультацию",
    description: "Комментарий",
    required: false,
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
