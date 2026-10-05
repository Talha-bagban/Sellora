import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ParentCategory } from './parent-category.entity';
import { CreateParentCategoryDto } from './dto/create-parent-category.dto';
import { SubCategory } from './sub-category.entity';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { LeafCategory } from './leaf-category.entity';
import { CreateLeafCategoryDto } from './dto/create-leaf-category.dto';
import { RedisService } from '../redis/redis.service';
import { RedisKeys } from '../redis/redis.keys';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(ParentCategory)
    private readonly parentCategoryRepository: Repository<ParentCategory>,

    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,

    @InjectRepository(LeafCategory)
    private readonly leafCategoryRepository: Repository<LeafCategory>,

    private readonly redisService: RedisService,
  ) {}

  async findAll() {
    const cacheKey = RedisKeys.categories.all;

    // 1. Check Redis
    const cachedCategories = await this.redisService.get(cacheKey);
    if (cachedCategories) {
      console.log(cacheKey, '🟢 Redis CACHE HIT');
      return JSON.parse(cachedCategories);
    }
    // 2. Cache miss → get data from PostgreSQL
    
    console.log('🔴 Redis CACHE MISS');
    const categories = await this.parentCategoryRepository.find({
      relations: {
        subCategories: {
          leafCategories: true,
        },
      },
    });
    // 3. Store result in Redis
    await this.redisService.set(cacheKey, JSON.stringify(categories), 3600);
    console.log('💾 Categories saved to Redis');

    return categories;
  }

  async create(data: CreateParentCategoryDto) {

    const category = this.parentCategoryRepository.create(data);

    const savedCategory = await this.parentCategoryRepository.save(category);

    await this.redisService.del(RedisKeys.categories.all);

    return savedCategory;
  }
  // async createSubCategory(data: CreateSubCategoryDto) {
  //     const category = this.subCategoryRepository.create(data);

  //     return this.subCategoryRepository.save(category);
  // }
  async createSubCategory(data: CreateSubCategoryDto) {

    const parent = await this.parentCategoryRepository.findOne({
      where: { id: data.parentId },
    });

    if (!parent) {
      throw new NotFoundException('Parent category not found');
    }

    const category = this.subCategoryRepository.create(data);

    const savedCategory = await this.subCategoryRepository.save(category);

    await this.redisService.del(RedisKeys.categories.all);

    return savedCategory;
  }
  //   async createLeafCategory(data: CreateLeafCategoryDto) {
  //     const category = this.leafCategoryRepository.create(data);

  //     return this.leafCategoryRepository.save(category);
  //   }
  async createLeafCategory(data: CreateLeafCategoryDto) {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id: data.subCategoryId },
    });

    if (!subCategory) {
      throw new NotFoundException('Sub category not found');
    }

    const category = this.leafCategoryRepository.create(data);

    const savedCategory = await this.leafCategoryRepository.save(category);

    await this.redisService.del(RedisKeys.categories.all);

    return savedCategory;
  }
}
