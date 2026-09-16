import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateParentCategoryDto } from './dto/create-parent-category.dto';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { CreateLeafCategoryDto } from './dto/create-leaf-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  create(@Body() body: CreateParentCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Post('sub-categories')
  createSubCategory(@Body() body: CreateSubCategoryDto) {
    return this.categoriesService.createSubCategory(body);
  }

  @Post('leaf-categories')
  createLeafCategory(@Body() body: CreateLeafCategoryDto) {
    return this.categoriesService.createLeafCategory(body);
  }
}
