import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity.js';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }
  // create(data: any) {
  //     const user = this.userRepository.create(data);
  //     return this.userRepository.save(user);
  // }
  // async create(data: CreateUserDto) {
  //   const hashedPassword = await bcrypt.hash(data.password, 10);

  //   const user = this.userRepository.create({
  //     ...data,
  //     password: hashedPassword,
  //   });

  //   return this.userRepository.save(user);
  // }

  async create(data: CreateUserDto) {
    const isEmail = data.identifier.includes('@');

    const user = this.userRepository.create({
      name: data.name,
      email: isEmail ? data.identifier : null,
      phone: isEmail ? null : data.identifier,
      password: await bcrypt.hash(data.password, 10),
    });

    return this.userRepository.save(user);
  }

  // async login(identifier: string, password: string) {
  //   const user = await this.userRepository
  //     .createQueryBuilder('user')
  //     .addSelect('user.password')
  //     .where('user.email = :identifier', { identifier })
  //     .orWhere('user.phone = :identifier', { identifier })
  //     .getOne();

  //   if (!user) {
  //     throw new UnauthorizedException('Invalid email/phone or password');
  //   }

  //   const isPasswordValid = await bcrypt.compare(password, user.password);

  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid email/phone or password');
  //   }

  //   return {
  //     message: 'Login successful',
  //     user: {
  //       id: user.id,
  //       name: user.name,
  //       email: user.email,
  //       phone: user.phone,
  //     },
  //   };
  // }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.email !== undefined) {
      user.email = data.email;
    }

    if (data.phone !== undefined) {
      user.phone = data.phone;
    }

    if (data.name !== undefined) {
      user.name = data.name;
    }

    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }
}
