import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CONFIG_MODULES } from './app.provider';
import { AppService } from './app.service';

@Module({
  imports: [...CONFIG_MODULES],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
