import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { ParentCategory } from '../categories/parent-category.entity';
import { SubCategory } from '../categories/sub-category.entity';
import { LeafCategory } from '../categories/leaf-category.entity';
import { City } from '../locations/city.entity';
import { Area } from '../locations/area.entity';
import { Ad } from '../ads/ad.entity';
import { AdImage } from '../ads/ad-image.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  entities: [User, ParentCategory,SubCategory, LeafCategory, City, Area, Ad, AdImage],

  migrations: ['src/database/migrations/*.ts'],
});

export { dataSource };