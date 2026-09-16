import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { City } from './city.entity';
import { Ad } from '../ads/ad.entity';

@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cityId: string;

  @ManyToOne(() => City, (city) => city.areas)
  @JoinColumn({ name: 'cityId' })
  city: City;

  @OneToMany(() => Ad, (ad) => ad.area)
  ads: Ad[];
}
