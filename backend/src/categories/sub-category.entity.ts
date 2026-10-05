import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import type { ParentCategory } from './parent-category.entity.js';
import { LeafCategory } from './leaf-category.entity.js';

@Entity('sub_categories')
export class SubCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: false })
  parentId: string;

  // @ManyToOne(() => ParentCategory, (parent) => parent.subCategories)
  @ManyToOne('ParentCategory', (parent: ParentCategory) => parent.subCategories)
  @JoinColumn({ name: 'parentId' })
  parent: ParentCategory;

  @OneToMany(() => LeafCategory, (leafCategory) => leafCategory.subCategory)
  leafCategories: LeafCategory[];
}
