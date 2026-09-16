import { api } from './api';
import { City, Area } from '@/types/location';

export const locationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<City[], void>({
      query: () => '/locations/cities',
    }),

    getAreasByCity: builder.query<Area[], string>({
      query: (cityId) => `/locations/cities/${cityId}/areas`,
    }),
  }),
});

export const {
  useGetCitiesQuery,
  useGetAreasByCityQuery,
} = locationApi;