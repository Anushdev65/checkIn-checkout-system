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
        headers.set(`Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["CheckIn"],

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

    userCheckIn: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/time/tracker/checkin`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["CheckIn"],
    }),
    userCheckOut: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/time/tracker/checkout`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["CheckIn"],
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
    pausedDuration: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/time/tracker/pause/duration`,
          method: "POST",
          body: body,
        };
      },
    }),
    saveCheckInTime: builder.query({
      query: (id) => {
        return {
          url: `/time/tracker/save/checkin/${id}`,
          method: "GET",
        };
      },
      providesTags: ["CheckIn"],
    }),
  }),
});

export const {
  useAddTimeTrackerMutation,
  useLazyDetailAllTimeTrackerQuery,
  useEditTimeTrackerMutation,
  useLazyDetailByIdTimeTrackerQuery,
  useDeleteTimeTrackerMutation,
  useUserCheckInMutation,
  useUserCheckOutMutation,
  useDurationMutation,
  useResumeTimerMutation,
  usePauseTimerMutation,
  usePausedDurationMutation,
  useSaveCheckInTimeQuery,
} = timeTrackerApi;
