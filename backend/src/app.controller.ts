import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { RedisService } from './redis/redis.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly redisService: RedisService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
