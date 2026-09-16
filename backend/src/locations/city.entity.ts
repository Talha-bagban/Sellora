import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Area } from './area.entity'
import { Ad } from '../ads/ad.entity';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  state: string;

  @OneToMany(() => Area, (area) => area.city)
  areas: Area[];

  @OneToMany(() => Ad, (ad) => ad.city)
  ads: Ad[];
}