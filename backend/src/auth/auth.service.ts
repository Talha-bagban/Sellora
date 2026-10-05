import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async login(identifier: string, password: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :identifier', { identifier })
      .orWhere('user.phone = :identifier', { identifier })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid email/phone or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email/phone or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      message: 'Login successful',
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    };
  }

  async checkIdentifier(identifier: string) {
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { phone: identifier }],
    });

    return {
      exists: !!user,
    };
  }
}
