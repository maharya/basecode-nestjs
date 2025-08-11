import { AuthConfigService } from '@config/auth/config.provider';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import { Algorithm } from 'jsonwebtoken';
import { DateTime } from 'luxon';
import {
  ICreateToken,
  ITokenConfig,
  ITokenOptions,
} from '../interfaces/auth.provider.interface';

@Injectable()
export class AuthProvider {
  constructor(
    private readonly authConfigService: AuthConfigService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createToken(
    tokenOption: ITokenOptions,
    {
      expiresIn = this.authConfigService.defaultExpireTime,
      issuer = this.configService.get('app.name'),
      expirationType = 'second',
    }: ITokenConfig = {},
  ): Promise<ICreateToken> {
    const { algorithm } = this.authConfigService;

    const expirationTime = `${expiresIn} ${expirationType}`;
    const epochExpired = DateTime.now()
      .plus({ [expirationType || 'second']: expiresIn })
      .toUnixInteger();

    const token = this.jwtService.sign(tokenOption.payload, {
      secret: this.getKeyFile(tokenOption.key),
      algorithm: algorithm as Algorithm,
      audience: tokenOption.audience,
      expiresIn: expirationTime,
      issuer: issuer || this.configService.get('app.name'),
    });

    return { expiresIn: epochExpired, token };
  }

  getKeyFile(filename: string): Buffer {
    const fileRoute = this.authConfigService.keyFolderPath;
    const filePath = `${fileRoute}${filename}`;

    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException('file secret not found');
    }

    return fs.readFileSync(filePath);
  }
}
