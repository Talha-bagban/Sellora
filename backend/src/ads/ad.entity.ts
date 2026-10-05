import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import type { User } from '../users/user.entity.js';
import { LeafCategory } from '../categories/leaf-category.entity.js';
import { City } from '../locations/city.entity.js';
import { Area } from '../locations/area.entity.js';
import { AdStatus } from './enums/ad-status.enum.js';
import { AdImage } from './ad-image.entity.js';

@Entity('ads')
export class Ad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('numeric')
  price: number;

  @Column()
  categoryId: string;

  @ManyToOne(() => LeafCategory)
  @JoinColumn({ name: 'categoryId' })
  category: LeafCategory;

  @Column()
  cityId: string;

  @ManyToOne(() => City)
  @JoinColumn({ name: 'cityId' })
  city: City;

  @Column()
  areaId: string;

  @ManyToOne(() => Area)
  @JoinColumn({ name: 'areaId' })
  area: Area;

  @Column()
  userId: string;

  @ManyToOne('User')
  @JoinColumn({ name: 'userId' })
  user: User;
  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'userId' })
  // user: User;

  @Column({
    type: 'enum',
    enum: AdStatus,
    default: AdStatus.ACTIVE,
  })
  status: AdStatus;

  @Column({ default: 0 })
  views: number;

  @OneToMany(() => AdImage, (image) => image.ad, {
    cascade: true,
  })
  images: AdImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
