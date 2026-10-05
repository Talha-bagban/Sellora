import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ad } from './ad.entity.js';
import { AdsService } from './ads.service.js';
import { AuthModule } from '../auth/auth.module.js';

import { LeafCategory } from '../categories/leaf-category.entity.js';
import { City } from '../locations/city.entity.js';
import { Area } from '../locations/area.entity.js';
import { AdsController } from './ads.controller.js';
import { AdImage } from './ad-image.entity.js';
import { AdImagesService } from './ad-images.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ad,
      AdImage,
      LeafCategory,
      City,
      Area,
    ]),
    AuthModule
  ],
  controllers: [AdsController],
  providers: [AdsService, AdImagesService],
})
export class AdsModule {}