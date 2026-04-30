import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { RequestsService } from "./requests.service";
import { CreateRequestDto } from "./dto/create-request.dto";

@ApiTags("requests")
@Controller("requests")
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiOperation({ summary: "Отправить заявку на услугу" })
  @ApiBody({ type: CreateRequestDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Заявка успешно отправлена",
    schema: { example: { ok: true, message: "Заявка принята" } },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Неверные данные",
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Ошибка отправки заявки",
  })
  async create(@Body() createRequestDto: CreateRequestDto) {
    try {
      return await this.requestsService.sendRequest(createRequestDto);
    } catch (error) {
      throw new HttpException(
        "Ошибка отправки заявки в VK",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
