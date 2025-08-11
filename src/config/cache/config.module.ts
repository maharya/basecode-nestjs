import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
import { RedisService } from './config.provider';
import schema from './schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      validationSchema: schema,
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      useFactory: (redisService: RedisService) => ({
        store: () => {
          return {
            get: async <T>(key: string): Promise<T | undefined> => {
              const result = await redisService.get(key);
              return result ? (JSON.parse(result) as T) : undefined;
            },
            set: async <T>(
              key: string,
              value: T,
              ttl: number,
            ): Promise<void> => {
              await redisService.set(
                key,
                JSON.stringify(value),
                'EX',
                ttl || 30,
              );
            },
            del: async (key: string): Promise<void> => {
              await redisService.del(key);
            },
          };
        },
      }),
      inject: [RedisService, ConfigService],
      extraProviders: [RedisService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService, CacheModule],
})
export class RedisConfigModule {}
