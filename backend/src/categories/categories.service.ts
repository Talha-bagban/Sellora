import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ParentCategory } from './parent-category.entity';
import { CreateParentCategoryDto } from './dto/create-parent-category.dto';
import { SubCategory } from './sub-category.entity';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { LeafCategory } from './leaf-category.entity';
import { CreateLeafCategoryDto } from './dto/create-leaf-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(ParentCategory)
    private readonly parentCategoryRepository: Repository<ParentCategory>,

    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,

    @InjectRepository(LeafCategory)
    private readonly leafCategoryRepository: Repository<LeafCategory>,
  ) {}

  async findAll() {
    return this.parentCategoryRepository.find({
      relations: {
        subCategories: {
          leafCategories: true,
        },
      },
    });
  }

  async create(data: CreateParentCategoryDto) {
    const category = this.parentCategoryRepository.create(data);

    return this.parentCategoryRepository.save(category);
  }
  // async createSubCategory(data: CreateSubCategoryDto) {
  //     const category = this.subCategoryRepository.create(data);

  //     return this.subCategoryRepository.save(category);
  // }
  async createSubCategory(data: CreateSubCategoryDto) {
    const parent = await this.parentCategoryRepository.findOne({
      where: { id: data.parentId },
    });

    if (!parent) {
      throw new NotFoundException('Parent category not found');
    }

    const category = this.subCategoryRepository.create(data);

    return this.subCategoryRepository.save(category);
  }
  //   async createLeafCategory(data: CreateLeafCategoryDto) {
  //     const category = this.leafCategoryRepository.create(data);

  //     return this.leafCategoryRepository.save(category);
  //   }
  async createLeafCategory(data: CreateLeafCategoryDto) {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id: data.subCategoryId },
    });

    if (!subCategory) {
      throw new NotFoundException('Sub category not found');
    }

    const category = this.leafCategoryRepository.create(data);

    return this.leafCategoryRepository.save(category);
  }
}
