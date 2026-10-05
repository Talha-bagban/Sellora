import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ad } from './ad.entity.js';
import { LeafCategory } from '../categories/leaf-category.entity.js';
import { City } from '../locations/city.entity.js';
import { Area } from '../locations/area.entity.js';
import { CreateAdDto } from './dto/create-ad.dto.js';
import { UpdateAdDto } from './dto/update-ad.dto.js';
import { AdStatus } from './enums/ad-status.enum.js';
import { AdImage } from './ad-image.entity.js';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { RedisService } from '../redis/redis.service.js';
import { RedisKeys } from '../redis/redis.keys.js';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,

    @InjectRepository(LeafCategory)
    private readonly leafCategoryRepository: Repository<LeafCategory>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,

    @InjectRepository(AdImage)
    private readonly adImageRepository: Repository<AdImage>,

    private readonly redisService: RedisService,
  ) {}

  async createAd(data: CreateAdDto, userId: string) {
    const category = await this.leafCategoryRepository.findOne({
      where: { id: data.categoryId },
      relations: {
        subCategory: {
          parent: true,
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const city = await this.cityRepository.findOne({
      where: { id: data.cityId },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    const area = await this.areaRepository.findOne({
      where: { id: data.areaId },
    });

    if (!area) {
      throw new NotFoundException('Area not found');
    }

    if (area.cityId !== data.cityId) {
      throw new BadRequestException(
        'Area does not belong to the selected city',
      );
    }

    const ad = this.adRepository.create({
      ...data,
      userId,
    });

    await this.redisService.delByPattern(RedisKeys.ads.list);

    return this.adRepository.save(ad);
  }

  async findAll(
    page = 1,
    limit = 20,
    search?: string,
    categoryId?: string,
    cityId?: string,
    areaId?: string,
    minPrice?: number,
    maxPrice?: number,
    sort = 'newest',
  ) {
    const cacheKey = [
      'ads:list',
      `page=${page}`,
      `limit=${limit}`,
      `search=${search ?? ''}`,
      `categoryId=${categoryId ?? ''}`,
      `cityId=${cityId ?? ''}`,
      `areaId=${areaId ?? ''}`,
      `minPrice=${minPrice ?? ''}`,
      `maxPrice=${maxPrice ?? ''}`,
      `sort=${sort}`,
    ].join(':');

    const cachedAds = await this.redisService.get(cacheKey);

    if (cachedAds) {
      console.log(cacheKey, '🟢 Ads Redis CACHE HIT');
      return JSON.parse(cachedAds);
    }

    console.log('🔴 Ads Redis CACHE MISS');

    const query = this.adRepository
      .createQueryBuilder('ad')
      .leftJoinAndSelect('ad.category', 'category')
      .leftJoinAndSelect('ad.city', 'city')
      .leftJoinAndSelect('ad.area', 'area')
      .leftJoinAndSelect('ad.images', 'images');

    switch (sort) {
      case 'price_asc':
        query.orderBy('ad.price', 'ASC');
        break;

      case 'price_desc':
        query.orderBy('ad.price', 'DESC');
        break;

      case 'oldest':
        query.orderBy('ad.createdAt', 'ASC');
        break;

      case 'newest':
      default:
        query.orderBy('ad.createdAt', 'DESC');
        break;
    }
    //   .orderBy('ad.createdAt', 'DESC')
    //   .skip((page - 1) * limit)
    //   .take(limit);
    // Pagination

    query.skip((page - 1) * limit).take(limit);

    if (search) {
      query.andWhere(
        '(ad.title ILIKE :search OR ad.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (categoryId) {
      query.andWhere('ad.categoryId = :categoryId', {
        categoryId,
      });
    }
    if (cityId) {
      query.andWhere('ad.cityId = :cityId', {
        cityId,
      });
    }
    if (areaId) {
      query.andWhere('ad.areaId = :areaId', {
        areaId,
      });
    }
    if (minPrice !== undefined) {
      query.andWhere('ad.price >= :minPrice', {
        minPrice,
      });
    }

    if (maxPrice !== undefined) {
      query.andWhere('ad.price <= :maxPrice', {
        maxPrice,
      });
    }

    const [ads, total] = await query.getManyAndCount();

    const result = {
      data: ads,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    await this.redisService.set(cacheKey, JSON.stringify(result), 900);

    return result;
  }

  async findOne(id: string) {
    const cacheKey = RedisKeys.ads.detail(id);

    // 1. Check Redis
    const cachedAd = await this.redisService.get(cacheKey);

    if (cachedAd) {
      console.log('🟢 Ad detail Redis CACHE HIT');

      const ad = JSON.parse(cachedAd);

      // Increment views in PostgreSQL
      await this.adRepository.increment({ id }, 'views', 1);

      ad.views += 1;

      await this.redisService.set(cacheKey, JSON.stringify(ad), 300);

      return ad;
    }

    console.log('🔴 Ad detail Redis CACHE MISS');

    // 2. Cache miss → PostgreSQL
    const ad = await this.adRepository.findOne({
      where: { id },
      relations: {
        category: true,
        city: true,
        area: true,
        images: true,
      },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    // 3. Increment views
    await this.adRepository.increment({ id }, 'views', 1);
    ad.views += 1;

    // 4. Cache the result
    await this.redisService.set(cacheKey, JSON.stringify(ad), 300);

    return ad;
  }

  async updateAd(id: string, data: UpdateAdDto, userId: string) {
    const ad = await this.adRepository.findOne({
      where: { id },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    if (ad.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this ad');
    }

    if (data.areaId || data.cityId) {
      const cityId = data.cityId ?? ad.cityId;
      const areaId = data.areaId ?? ad.areaId;

      const area = await this.areaRepository.findOne({
        where: { id: areaId },
      });

      if (!area) {
        throw new NotFoundException('Area not found');
      }

      if (area.cityId !== cityId) {
        throw new BadRequestException(
          'Area does not belong to the selected city',
        );
      }
    }

    Object.assign(ad, data);

    await this.redisService.delByPattern(RedisKeys.ads.list);

    await this.redisService.del(RedisKeys.ads.detail(id));

    return this.adRepository.save(ad);
  }

  async deleteAd(id: string, userId: string) {
    const ad = await this.adRepository.findOne({
      where: { id },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    if (ad.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this ad');
    }

    const images = await this.adImageRepository.find({
      where: { adId: id },
    });

    for (const image of images) {
      //   const filePath = join(process.cwd(), image.imageUrl);
      const filePath = join(process.cwd(), image.imageUrl.replace(/^\/+/, ''));

      try {
        await unlink(filePath);
      } catch (error) {
        // File may already be missing; don't block ad deletion.
      }
    }

    await this.adRepository.remove(ad);

    await this.redisService.delByPattern(RedisKeys.ads.list);
    await this.redisService.del(RedisKeys.ads.detail(id));

    return {
      message: 'Ad deleted successfully',
    };
  }

  async updateStatus(id: string, status: AdStatus, userId: string) {
    const ad = await this.adRepository.findOne({
      where: { id },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    if (ad.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this ad');
    }

    ad.status = status;

    const updateStatusAd = await this.adRepository.save(ad);

    await this.redisService.delByPattern(RedisKeys.ads.list);
    await this.redisService.del(RedisKeys.ads.detail(id));

    return updateStatusAd;
  }

  async findMyAds(userId: string, page = 1, limit = 20, status?: AdStatus) {
    const [ads, total] = await this.adRepository.findAndCount({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      relations: {
        images: true,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: ads,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
