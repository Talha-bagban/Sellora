import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import type { Ad } from './ad.entity.js';

@Unique(['adId', 'sortOrder'])
@Entity('ad_images')
export class AdImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  adId: string;

  @ManyToOne('Ad', (ad: Ad) => ad.images, {
    onDelete: 'CASCADE',
  })

  @JoinColumn({ name: 'adId' })
  ad: Ad;

  @Column()
  imageUrl: string;

  @Column({ type: 'varchar', nullable: true })
  cloudinaryPublicId: string | null;

  @Column({ default: 0 })
  sortOrder: number;
}