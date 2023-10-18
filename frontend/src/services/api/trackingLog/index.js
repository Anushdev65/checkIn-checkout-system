import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../config/constant";
import { getLevelInfo } from "../../../localStorage/localStorage";

export const trackingLogApi = createApi({
  reducerPath: "trackingLogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeader: (headers) => {
      const levelInfo = getLevelInfo();
      const token = levelInfo && levelInfo.token ? levelInfo.token : "";
      if (token) {
        headers.set(`Breaker ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    addTrackingLog: builder.mutation({
      query: (body) => {
        return {
          url: `/tracking/log`,
          method: "POST",
          body: body,
        };
      },
    }),

    detailAllTrackingLog: builder.query({
      query: () => {
        return {
          url: `/tracking/log`,
          method: "GET",
        };
      },
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
  useLazyDetailAllTrackingLogQuery,
  useEditTrackingLogMutation,
  useLazyDetailSpecificTrackingLogQuery,
  useDeleteTrackingLogMutation,
} = trackingLogApi;
