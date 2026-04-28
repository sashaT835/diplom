import { Module } from "@nestjs/common";
import { RequestsService } from "./requests.service";
import { RequestsController } from "./requests.controller";
import { RealtimeModule } from "../realtime/realtime.module";

@Module({
  controllers: [RequestsController],
  imports: [RealtimeModule],
  providers: [RequestsService],
})
export class RequestsModule {}
