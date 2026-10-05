import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  // @Post('login')
  // login(@Body() body: LoginUserDto) {
  //   return this.usersService.login(body.identifier, body.password);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }
}
