import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParentCategory } from './parent-category.entity';
import { SubCategory } from './sub-category.entity';
import { LeafCategory } from './leaf-category.entity';

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
