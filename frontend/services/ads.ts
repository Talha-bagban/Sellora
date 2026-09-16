// import { apiFetch } from './api';

// export interface GetAdsParams {
//   cityId?: string;
//   areaId?: string;
//   categoryId?: string;
//   search?: string;
// }

// export function getAds(params: GetAdsParams = {}) {
//   const query = new URLSearchParams();

//   if (params.cityId) query.set('cityId', params.cityId);
//   if (params.areaId) query.set('areaId', params.areaId);
//   if (params.categoryId) query.set('categoryId', params.categoryId);
//   if (params.search) query.set('search', params.search);

//   return apiFetch(`/ads?${query.toString()}`);
// }