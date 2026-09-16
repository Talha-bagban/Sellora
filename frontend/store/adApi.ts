import { api } from "./api";
import { Ad, AdImage, AdsResponse } from "@/types/ad";

interface GetAdsParams {
  cityId?: string;
  areaId?: string;
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
}

interface CreateAdRequest {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  cityId: string;
  areaId: string;
}

export const adApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAds: builder.query<AdsResponse, GetAdsParams>({
      query: (params) => ({
        url: "/ads",
        params,
      }),
    }),

    createAd: builder.mutation<Ad, CreateAdRequest>({
      query: (body) => ({
        url: "/ads",
        method: "POST",
        body,
      }),
    }),

    updateAd: builder.mutation<
      Ad,
      {
        id: string;
        body: Partial<CreateAdRequest>;
      }
    >({
      query: ({ id, body }) => ({
        url: `/ads/${id}`,
        method: "PATCH",
        body,
      }),
    }),

    uploadAdImage: builder.mutation<
      AdImage[],
      {
        adId: string;
        file: File;
      }
    >({
      query: ({ adId, file }) => {
        const formData = new FormData();

        formData.append("file", file);

        return {
          url: `/ads/${adId}/images/upload`,
          method: "POST",
          body: formData,
        };
      },
    }),

    getMyAds: builder.query<AdsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 }) => ({
        url: "/ads/my",
        params: {
          page,
          limit,
        },
      }),
    }),

    getAdById: builder.query<Ad, string>({
      query: (id) => `/ads/${id}`,
    }),

    deleteAdImage: builder.mutation<{ message: string }, string>({
      query: (imageId) => ({
        url: `/ads/images/${imageId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAdsQuery,
  useCreateAdMutation,
  useUploadAdImageMutation,
  useGetMyAdsQuery,
  useGetAdByIdQuery,
  useUpdateAdMutation,
  useDeleteAdImageMutation
} = adApi;
