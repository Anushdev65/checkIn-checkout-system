import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../config/constant";
import { getLevelInfo } from "../../../localStorage/localStorage";

export const trackingLogApi = createApi({
  reducerPath: "trackingLogApi",
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
  tagTypes: ["detailTrackingLog"],

  endpoints: (builder) => ({
    addTrackingLog: builder.mutation({
      query: (body) => {
        return {
          url: `/tracking/log`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["detailTrackingLog"],
    }),

    detailAllTrackingLog: builder.query({
      query: () => {
        return {
          url: `/tracking/log`,
          method: "GET",
        };
      },
      providesTags: ["detailTrackingLog"],
    }),

    editTrackingLog: builder.mutation({
      query: ({ body, id }) => {
        return {
          url: `/tracking/log`,
          method: "PUT",
          body: body,
        };
      },
    }),

    detailSpecificTrackingLog: builder.query({
      query: ({ id }) => {
        return {
          url: `/tracking/log/${id}`,
          method: "GET",
        };
      },
    }),

    deleteTrackingLog: builder.mutation({
      query: ({ body, id }) => {
        return {
          url: `/tracking/log/${id}`,
          method: "DELETE",
          body: body,
        };
      },
    }),
  }),
});

export const {
  useAddTrackingLogMutation,
  useDetailAllTrackingLogQuery,
  useEditTrackingLogMutation,
  useDetailSpecificTrackingLogQuery,
  useDeleteTrackingLogMutation,
} = trackingLogApi;
