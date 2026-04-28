import { IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MarkReadDto {
  @ApiProperty({ example: 1, description: "ID пользователя" })
  @IsInt()
  userId: number;
}
