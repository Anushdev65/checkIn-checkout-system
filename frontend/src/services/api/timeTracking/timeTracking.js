import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../config/constant";
import { getLevelInfo } from "../../../localStorage/localStorage";

export const timeTrackerApi = createApi({
  reducerPath: "timeTrackerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeader: (headers) => {
      const levelInfo = getLevelInfo();
      const token = levelInfo && levelInfo.token ? levelInfo.token : "";
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  // Fetching API from timeTracker router
  endpoints: (builder) => ({
    addTimeTracker: builder.mutation({
      query: (body) => {
        return {
          url: `/time/tracker`,
          method: "POST",
          body: body,
        };
      },
    }),
    DetailAllTimeTracker: builder.query({
      query: () => {
        return {
          url: `/time/tracker`,
          method: "GET",
        };
      },
    }),

    editTimeTracker: builder.mutation({
      query: ({ body, id }) => {
        return {
          url: `/time/tracker/${id}`,
          method: "PUT",
          body: body,
        };
      },
    }),

    DetailByIdTimeTracker: builder.query({
      query: ({ id }) => {
        return {
          url: `/time/tracker/${id}`,
          method: "GET",
        };
      },
    }),

    deleteTimeTracker: builder.mutation({
      query: ({ body, id }) => {
        return {
          url: `/time/tracker/${id}`,
          method: "DELETE",
          body: body,
        };
      },
    }),

    userCheckin: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/time/tracker/checkin`,
          method: "POST",
          body: body,
        };
      },
    }),
    userCheckout: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/time/tracker/checkout`,
          method: "POST",
          body: body,
        };
      },
    }),
    duration: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/time/tracker/duration`,
          method: "POST",
          body: body,
        };
      },
    }),
    resumeTimer: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/time/tracker/resume/timer`,
          method: "POST",
          body: body,
        };
      },
    }),
    pauseTimer: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/time/tracker/pause/timer`,
          method: "POST",
          body: body,
        };
      },
    }),
  }),
});

export const {
  useAddTimeTrackerMutation,
  useLazyDetailAllTimeTrackerQuery,
  useEditTimeTrackerMutation,
  useLazyDetailByIdTimeTrackerQuery,
  useDeleteTimeTrackerMutation,
  useUserCheckinMutation,
  useUserCheckoutMutation,
  useDurationMutation,
  useResumeTimerMutation,
  usePauseTimerMutation,
} = timeTrackerApi;
