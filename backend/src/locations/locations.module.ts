import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { City } from './city.entity.js';
import { Area } from './area.entity.js';
import { LocationsService } from './locations.service.js';
import { LocationsController } from './locations.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([City, Area])],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
