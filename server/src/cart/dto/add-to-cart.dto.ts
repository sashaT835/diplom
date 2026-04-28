import { IsInt, IsPositive, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddToCartDto {
  @ApiProperty({ example: 1, description: "ID товара" })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({ example: 1, description: "Количество товара", default: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number = 1;
}
