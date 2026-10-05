import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity.js';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // providers: [AuthService],
      providers: [
        AuthService,

        {
          provide: getRepositoryToken(User),
          useValue: {},
        },

        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
