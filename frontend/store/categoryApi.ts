import { api } from './api';

export interface LeafCategory {
  id: string;
  name: string;
  slug: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  leafCategories: LeafCategory[];
}

export interface ParentCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  subCategories: SubCategory[];
}

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ParentCategory[], void>({
      query: () => '/categories',
    }),
  }),
});

export const {
  useGetCategoriesQuery,
} = categoryApi;