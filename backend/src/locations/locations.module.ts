import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { City } from './city.entity';
import { Area } from './area.entity';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([City, Area])],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class LocationsModule {}
