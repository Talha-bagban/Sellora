import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import type { City } from './city.entity.js';
import { Ad } from '../ads/ad.entity.js';

@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cityId: string;

@ManyToOne('City', (city: City) => city.areas)
  @JoinColumn({ name: 'cityId' })
  city: City;

  @OneToMany(() => Ad, (ad) => ad.area)
  ads: Ad[];
}
