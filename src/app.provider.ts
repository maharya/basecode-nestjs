import { AppConfigModule } from '@config/app/config.module';
import { AuthConfigModule } from '@config/auth/config.module';
import { RedisConfigModule } from '@config/cache/config.module';
import { DBConfigModule } from '@config/database/config.module';
import { AuthModule } from 'modules/auth/auth.module';

export const CONFIG_MODULES = [
  AppConfigModule,
  AuthConfigModule,
  DBConfigModule,
  RedisConfigModule,
];

export const APPLICATION_MODULES = [AuthModule];
