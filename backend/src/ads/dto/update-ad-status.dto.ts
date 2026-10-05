import { IsIn } from 'class-validator';
import { AdStatus } from '../enums/ad-status.enum.js';

export class UpdateAdStatusDto {
  @IsIn(['active', 'sold', 'inactive'])
  status: AdStatus;
}