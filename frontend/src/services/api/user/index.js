import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../config/constant";
import { getLevelInfo } from "../../../localStorage/localStorage";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers) => {
      const levelInfo = getLevelInfo();
      const token = levelInfo && levelInfo.token ? levelInfo.token : "";
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (body) => {
        return {
          url: `/auth/register`,
          method: "POST",
          body: body,
        };
      },
    }),

    loginUser: builder.mutation({
      query: (body) => {
        return {
          url: `/auth/login`,
          method: "POST",
          body: body,
        };
      },
    }),

    getMyProfile: builder.query({
      query: () => {
        return {
          url: `auth/my-profile`,
          method: "GET",
        };
      },
      providesTags: ["getMyProfile"],
    }),

    logoutUser: builder.mutation({
      query: () => {
        return {
          url: `/auth/logout`,
          method: "PATCH",
        };
      },
    }),
  }),
});
export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetMyProfileQuery,
} = userApi;
