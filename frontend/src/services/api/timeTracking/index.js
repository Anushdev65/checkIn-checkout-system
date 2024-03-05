import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../config/constant";
import { getLevelInfo } from "../../../localStorage/localStorage";

export const timeTrackerApi = createApi({
  reducerPath: "timeTrackerApi",
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
    detailAllTimeTracker: builder.query({
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

    detailByIdTimeTracker: builder.query({
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
      invalidatesTags: ["CheckIn"],
    }),
    pauseTimer: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/time/tracker/pause/timer`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["CheckIn"],
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

    notes: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/time/Tracker/note`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["CheckIn"],
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
  useNotesMutation,
  useSaveCheckInTimeQuery,
} = timeTrackerApi;
