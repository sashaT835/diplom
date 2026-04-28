import { ApiProperty } from "@nestjs/swagger";

export class Service {
  @ApiProperty({ example: 1, description: "ID услуги" })
  id: number;

  @ApiProperty({ example: "Установка 1С", description: "Название услуги" })
  name: string;

  @ApiProperty({ example: 45000, description: "Цена услуги" })
  price: number;

  @ApiProperty({
    example: "Проводим полную установку 1С на вашем сервере",
    description: "Описание услуги",
  })
  description?: string;

  @ApiProperty({ description: "Дата создания" })
  createdAt: Date;

  @ApiProperty({ description: "Дата обновления" })
  updatedAt: Date;
}
