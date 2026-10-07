import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { LocationsModule } from './locations/locations.module.js';
import { AdsModule } from './ads/ads.module.js';
import { RedisModule } from './redis/redis.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || undefined,

      host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,

      port: process.env.DATABASE_URL ? undefined : Number(process.env.DB_PORT),

      username: process.env.DATABASE_URL ? undefined : process.env.DB_USERNAME,

      password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,

      database: process.env.DATABASE_URL ? undefined : process.env.DB_DATABASE,

      autoLoadEntities: true,
      synchronize: false,
      // host: process.env.DB_HOST,
      // port: Number(process.env.DB_PORT),
      // username: process.env.DB_USERNAME,
      // password: process.env.DB_PASSWORD,
      // database: process.env.DB_DATABASE,
      // autoLoadEntities: true,
      // synchronize: false,
    }),

    UsersModule,
    AuthModule,
    CategoriesModule,
    LocationsModule,
    AdsModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
