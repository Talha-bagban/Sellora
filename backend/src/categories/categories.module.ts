import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParentCategory } from './parent-category.entity.js';
import { SubCategory } from './sub-category.entity.js';
import { LeafCategory } from './leaf-category.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ParentCategory,
      SubCategory,
      LeafCategory
    ])
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule {}
