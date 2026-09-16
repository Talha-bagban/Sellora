import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ad } from './ad.entity';
import { AdsService } from './ads.service';
import { AuthModule } from '../auth/auth.module';

import { LeafCategory } from '../categories/leaf-category.entity';
import { City } from '../locations/city.entity';
import { Area } from '../locations/area.entity';
import { AdsController } from './ads.controller';
import { AdImage } from './ad-image.entity';
import { AdImagesService } from './ad-images.service';

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