import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { Ad } from './ad.entity';

@Unique(['adId', 'sortOrder'])
@Entity('ad_images')
export class AdImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  adId: string;

  @ManyToOne(() => Ad, (ad) => ad.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'adId' })
  ad: Ad;

  @Column()
  imageUrl: string;

  @Column({ default: 0 })
  sortOrder: number;
}