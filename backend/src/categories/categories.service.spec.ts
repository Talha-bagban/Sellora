import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service.js';
import { RedisService } from '../redis/redis.service.js';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,

        {
          provide: 'ParentCategoryRepository',
          useValue: {},
        },
        {
          provide: 'SubCategoryRepository',
          useValue: {},
        },
        {
          provide: 'LeafCategoryRepository',
          useValue: {},
        },
        {
          provide: RedisService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
