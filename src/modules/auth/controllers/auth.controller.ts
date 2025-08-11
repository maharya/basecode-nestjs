import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequest } from '../requests/login.request';
import { AuthService } from '../services/auth.service';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: LoginRequest,
  ): Promise<{ expiresIn: number; token: string }> {
    return this.authService.login(body);
  }
}
