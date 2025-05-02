import { Module } from "@nestjs/common";
import { RootController } from "src/controller/controller";
import { ChatGateway } from "src/gateWay/gateway";
import { CostService } from "src/services/marketService";

@Module({

    providers: [ ChatGateway, CostService],
    controllers: [ RootController ]
})
export class gatewayModule{}