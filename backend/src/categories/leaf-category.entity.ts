import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import type { SubCategory } from './sub-category.entity.js';
// import { Ad } from '../ads/ad.entity';

@Entity('leaf_categories')
export class LeafCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  subCategoryId: string;

  // @ManyToOne(() => SubCategory, (subCategory) => subCategory.leafCategories)
  @ManyToOne('SubCategory', (subCategory: SubCategory) => subCategory.leafCategories)
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: SubCategory;

//   @OneToMany(() => Ad, (ad) => ad.category)
//   ads: Ad[];
}