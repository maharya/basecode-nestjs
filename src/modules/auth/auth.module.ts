import { AuthConfigModule } from '@config/auth/config.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { UserLogin } from './models/UserLogin';
import { AuthProvider } from './services/auth.provider';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    AuthConfigModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserLogin]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthProvider],
})
export class AuthModule {}
