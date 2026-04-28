import { IsInt, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateQuantityDto {
  @ApiProperty({ example: 3, description: "Новое количество (0 — удалить)", minimum: 0 })
  @IsInt()
  @Min(0)
  quantity: number;
}
