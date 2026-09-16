import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { LocationsService } from './locations.service';
import { CreateCityDto } from './dto/create-city.dto';
import { CreateAreaDto } from './dto/create-area.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post('cities')
  createCity(@Body() body: CreateCityDto) {
    return this.locationsService.createCity(body);
  }

  @Post('areas')
  createArea(@Body() body: CreateAreaDto) {
    return this.locationsService.createArea(body);
  }

  @Get('cities')
  findAllCities() {
    return this.locationsService.findAllCities();
  }

  @Get('cities/:cityId/areas')
  findAreasByCity(@Param('cityId') cityId: string) {
    return this.locationsService.findAreasByCity(cityId);
  }
}
