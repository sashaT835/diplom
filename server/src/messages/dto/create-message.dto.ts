import { IsString, IsNotEmpty, IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMessageDto {
  @ApiProperty({ example: "Здравствуйте! Хочу узнать подробнее о товаре.", description: "Текст сообщения" })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 1, description: "ID получателя сообщения" })
  @IsInt()
  receiverId: number;
}
