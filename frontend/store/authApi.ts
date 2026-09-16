import { api } from "./api";

interface CheckIdentifierRequest {
  identifier: string;
}

interface CheckIdentifierResponse {
  exists: boolean;
}

interface LoginRequest {
  identifier: string;
  password: string;
}

interface LoginResponse {
  message: string;
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };
}

interface RegisterRequest {
  name: string;
  identifier: string;
  password: string;
}

interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    checkIdentifier: builder.mutation<
      CheckIdentifierResponse,
      CheckIdentifierRequest
    >({
      query: (body) => ({
        url: "/auth/check-identifier",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCheckIdentifierMutation,
  useLoginMutation,
  useRegisterMutation,
} = authApi;
