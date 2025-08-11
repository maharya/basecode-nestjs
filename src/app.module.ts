import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { APPLICATION_MODULES, CONFIG_MODULES } from './app.provider';
import { AppService } from './app.service';

@Module({
  imports: [...CONFIG_MODULES, ...APPLICATION_MODULES],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
