import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { gatewayModule } from './module/gateway.module';

@Module({
  imports: [ gatewayModule],
})
export class AppModule {}
