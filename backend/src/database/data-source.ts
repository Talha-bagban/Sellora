import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity.js';
import { ParentCategory } from '../categories/parent-category.entity.js';
import { SubCategory } from '../categories/sub-category.entity.js';
import { LeafCategory } from '../categories/leaf-category.entity.js';
import { City } from '../locations/city.entity.js';
import { Area } from '../locations/area.entity.js';
import { Ad } from '../ads/ad.entity.js';
import { AdImage } from '../ads/ad-image.entity.js';

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