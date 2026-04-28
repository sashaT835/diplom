import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ServicesService } from "./services.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { Service } from "./entities/service.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@ApiTags("services")
@ApiBearerAuth("access-token")
@Controller("services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Создать новую услугу" })
  @ApiBody({ type: CreateServiceDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Услуга успешно создана",
    type: Service,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Неверные данные",
  })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: "Получить все услуги" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Список услуг успешно получен",
    type: [Service],
  })
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить услугу по ID" })
  @ApiParam({
    name: "id",
    description: "ID услуги",
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Услуга успешно получена",
    type: Service,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Услуга не найдена",
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Обновить услугу" })
  @ApiParam({
    name: "id",
    description: "ID услуги",
    example: 1,
  })
  @ApiBody({ type: UpdateServiceDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Услуга успешно обновлена",
    type: Service,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Услуга не найдена",
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Удалить услугу" })
  @ApiParam({
    name: "id",
    description: "ID услуги",
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Услуга успешно удалена",
    type: Service,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Услуга не найдена",
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.servicesService.remove(id);
  }
}
