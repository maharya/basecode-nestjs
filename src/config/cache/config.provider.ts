import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { h32 } from 'xxhashjs';

@Injectable()
export class RedisService extends Redis {
  private readonly prefix: string;

  constructor(private readonly configService: ConfigService) {
    super({
      host: configService.getOrThrow('redis.host'),
      port: configService.getOrThrow('redis.port'),
      password: configService.get('redis.password'),
      keyPrefix: configService.get('redis.cachePrefix') || 'cis-audy',
      db: configService.get('redis.db'),
    });
    this.prefix = configService.get('redis.cachePrefix') || 'cis-audy';
  }

  async getCustomCache<T>(
    key: string | Record<string, unknown>,
    ttl: number,
    setValue: () => T | Promise<T>,
  ): Promise<T> {
    const generatedKey =
      typeof key === 'string' ? this.customKey(key) : this.generateKey(key);

    let cacheValue = await this.get(generatedKey);

    if (cacheValue) {
      return JSON.parse(cacheValue) as T;
    }

    const value = await setValue();

    if (!value) return value;

    cacheValue = JSON.stringify(value);

    await this.set(generatedKey, cacheValue, 'EX', ttl);

    return value as T;
  }

  private customKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  private generateKey(key: unknown): string {
    const hash = h32(0xabcd);
    return `${this.prefix}:${hash.update(JSON.stringify(key)).digest().toString(16)}`;
  }
}
