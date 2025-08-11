import { AuthConfigService } from '@config/auth/config.provider';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AUTH } from '@utils/constants';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { ILogin } from '../interfaces/auth.interface';
import { ICreateToken } from '../interfaces/auth.provider.interface';
import { UserLogin } from '../models/UserLogin';
import { AuthProvider } from './auth.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly authConfig: AuthConfigService,
    private readonly authProvider: AuthProvider,

    @InjectRepository(UserLogin)
    private userLoginRepository: Repository<UserLogin>,
  ) {}

  async login(dto: ILogin): Promise<ICreateToken> {
    const userLogin = await this.userLoginRepository.findOne({
      where: { username: dto.username },
    });

    if (!userLogin) {
      throw new UnauthorizedException('username or password is incorrect');
    }

    if (!(await compare(dto.password, userLogin.password))) {
      throw new UnauthorizedException('username or password is incorrect');
    }

    return this.createLoginToken(userLogin);
  }

  private async createLoginToken(
    userLogin: Pick<UserLogin, 'id' | 'username'>,
  ): Promise<ICreateToken> {
    return this.authProvider.createToken({
      payload: userLogin,
      key: this.authConfig.secret || '',
      audience: AUTH.AUDIENCE,
    });
  }
}
