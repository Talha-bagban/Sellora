import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { City } from './city.entity.js';
import { Area } from './area.entity.js';
import { CreateCityDto } from './dto/create-city.dto.js';
import { CreateAreaDto } from './dto/create-area.dto.js';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}

  async createCity(data: CreateCityDto) {
    const city = this.cityRepository.create(data);

    return this.cityRepository.save(city);
  }
  async createArea(data: CreateAreaDto) {
    const city = await this.cityRepository.findOne({
      where: { id: data.cityId },
    });

    if (!city) {
      throw new NotFoundException('City not found');
    }

    const area = this.areaRepository.create(data);

    return this.areaRepository.save(area);
  }

  async findAllCities() {
    return this.cityRepository.find({
      select: {
        id: true,
        name: true,
        state: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async findAreasByCity(cityId: string) {
    return this.areaRepository.find({
      where: {
        cityId,
      },
      select: {
        id: true,
        cityId: true,
        name: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }
}
