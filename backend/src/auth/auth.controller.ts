import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CheckIdentifierDto } from './dto/check-identifier.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() body: LoginUserDto) {
    return this.authService.login(body.identifier, body.password);
  }

  @Post('check-identifier')
  checkIdentifier(@Body() dto: CheckIdentifierDto) {
    return this.authService.checkIdentifier(dto.identifier);
  }
}
