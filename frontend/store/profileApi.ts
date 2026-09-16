import { api } from './api';

export interface Profile {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
}


export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, void>({
      query: () => '/users/profile',
       providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<Profile, UpdateProfileRequest>({
      query: (body) => ({
        url: '/users/profile',
        method: 'PATCH',
        body,
      }),
       invalidatesTags: ['Profile'],
    }),

  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation
} = profileApi;