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

import { User } from '../users/user.entity';
import { LeafCategory } from '../categories/leaf-category.entity';
import { City } from '../locations/city.entity';
import { Area } from '../locations/area.entity';
import { AdStatus } from './enums/ad-status.enum';
import { AdImage } from './ad-image.entity';

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

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