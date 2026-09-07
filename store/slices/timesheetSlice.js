import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

// =====================================================
// GET TIMESHEET
// GET /api/Timesheet
// =====================================================

export const fetchTimesheet = createAsyncThunk(
  "timesheet/fetchTimesheet",
  async (
    { empId, startDate, endDate },
    { rejectWithValue }
  ) => {
    try {
      const data = await api.get(
        `/api/Timesheet?empId=${empId}&startDate=${encodeURIComponent(
          startDate
        )}&endDate=${encodeURIComponent(endDate)}`
      );

      console.log("TIMESHEET API RESPONSE:", data);

      return data;
    } catch (error) {
      console.error("TIMESHEET API ERROR:", error);

      return rejectWithValue(
        error.message || "Failed to load timesheet."
      );
    }
  }
);

export const rescheduleTask = createAsyncThunk(
  "timesheet/rescheduleTask",
  async (request, { rejectWithValue }) => {
    try {
      const data = await api.post(
        "/api/Timesheet/reschedule",
        request
      );

      console.log("RESCHEDULE API RESPONSE:", data);

      return data;
    } catch (error) {
      console.error("RESCHEDULE API ERROR:", error);

      return rejectWithValue(
        error.message || "Failed to reschedule task."
      );
    }
  }
);

export const addTaskComment = createAsyncThunk(
  "timesheet/addTaskComment",
  async (commentData, { rejectWithValue }) => {
    try {
      console.log(
        "SENDING COMMENT DATA:",
        commentData
      );

      const data = await api.post(
        "/api/v1/Task/comment",
        commentData
      );

      console.log(
        "COMMENT API RESPONSE:",
        data
      );

      return data;

    } catch (error) {
      console.error(
        "COMMENT API ERROR:",
        error
      );

      return rejectWithValue(
        error.message ||
          "Failed to add task comment."
      );
    }
  }
);

// =====================================================
// GET TASK COMMENTS
// GET /api/v1/Task/{taskId}/comments
// =====================================================

export const fetchTaskComments = createAsyncThunk(
  "timesheet/fetchTaskComments",
  async (taskId, { rejectWithValue }) => {
    try {
      const data = await api.get(
        `/api/v1/Task/${taskId}/comments`
      );

      console.log("TASK COMMENTS API RESPONSE:", data);

      return data;
    } catch (error) {
      console.error("TASK COMMENTS API ERROR:", error);

      return rejectWithValue(
        error.message || "Failed to load task comments."
      );
    }
  }
);

// =====================================================
// GET PM NOTIFICATIONS
// GET /api/v1/Task/notifications
// =====================================================

export const fetchTaskNotifications = createAsyncThunk(
  "timesheet/fetchTaskNotifications",
  async (
    { recipientId, unreadOnly = true },
    { rejectWithValue }
  ) => {
    try {
      const data = await api.get(
        `/api/v1/Task/notifications?recipientId=${recipientId}&unreadOnly=${unreadOnly}`
      );

      console.log(
        "TASK NOTIFICATIONS API RESPONSE:",
        data
      );

      return data;
    } catch (error) {
      console.error(
        "TASK NOTIFICATIONS API ERROR:",
        error
      );

      return rejectWithValue(
        error.message || "Failed to load notifications."
      );
    }
  }
);

// =====================================================
// MARK NOTIFICATION AS READ
// PUT /api/v1/Task/notifications/{notificationId}/read
// =====================================================

export const markNotificationRead = createAsyncThunk(
  "timesheet/markNotificationRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const data = await api.put(
        `/api/v1/Task/notifications/${notificationId}/read`
      );

      console.log(
        "MARK NOTIFICATION READ RESPONSE:",
        data
      );

      return notificationId;
    } catch (error) {
      console.error(
        "MARK NOTIFICATION READ ERROR:",
        error
      );

      return rejectWithValue(
        error.message ||
          "Failed to mark notification as read."
      );
    }
  }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  tasks: [],
  loading: false,
  error: null,

  rescheduleLoading: false,
  rescheduleError: null,
  rescheduleSuccess: false,

  commentLoading: false,
  commentError: null,
  commentSuccess: false,

   // Comments
  taskComments: [],
  commentsLoading: false,
  commentsError: null,

  // Notifications
  notifications: [],
  notificationsLoading: false,
  notificationsError: null,
};

// =====================================================
// SLICE
// =====================================================

const timesheetSlice = createSlice({
  name: "timesheet",

  initialState,

  reducers: {
    clearTimesheet: (state) => {
      state.tasks = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchTimesheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTimesheet.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        console.log(
          "TIMESHEET DATA IN REDUX:",
          action.payload
        );

        state.tasks = action.payload?.tasks || [];
      })

      .addCase(rescheduleTask.pending, (state) => {
  state.rescheduleLoading = true;
  state.rescheduleError = null;
  state.rescheduleSuccess = false;
})

.addCase(rescheduleTask.fulfilled, (state) => {
  state.rescheduleLoading = false;
  state.rescheduleError = null;
  state.rescheduleSuccess = true;
})

.addCase(rescheduleTask.rejected, (state, action) => {
  state.rescheduleLoading = false;
  state.rescheduleError =
    action.payload || "Failed to reschedule task.";
  state.rescheduleSuccess = false;
})

.addCase(addTaskComment.pending, (state) => {
  state.commentLoading = true;
  state.commentError = null;
  state.commentSuccess = false;
})

.addCase(addTaskComment.fulfilled, (state) => {
  state.commentLoading = false;
  state.commentError = null;
  state.commentSuccess = true;
})

.addCase(addTaskComment.rejected, (state, action) => {
  state.commentLoading = false;
  state.commentError =
    action.payload || "Failed to add task comment.";
  state.commentSuccess = false;
})

// =====================================================
// TASK COMMENTS
// =====================================================

.addCase(fetchTaskComments.pending, (state) => {
  state.commentsLoading = true;
  state.commentsError = null;
})

.addCase(fetchTaskComments.fulfilled, (state, action) => {
  state.commentsLoading = false;
  state.commentsError = null;

  state.taskComments = Array.isArray(action.payload)
    ? action.payload
    : [];
})

.addCase(fetchTaskComments.rejected, (state, action) => {
  state.commentsLoading = false;
  state.commentsError =
    action.payload || "Failed to load task comments.";

  state.taskComments = [];
})

// =====================================================
// NOTIFICATIONS
// =====================================================

.addCase(fetchTaskNotifications.pending, (state) => {
  state.notificationsLoading = true;
  state.notificationsError = null;
})

.addCase(
  fetchTaskNotifications.fulfilled,
  (state, action) => {
    state.notificationsLoading = false;
    state.notificationsError = null;

    state.notifications = Array.isArray(action.payload)
      ? action.payload
      : [];
  }
)

.addCase(
  fetchTaskNotifications.rejected,
  (state, action) => {
    state.notificationsLoading = false;

    state.notificationsError =
      action.payload || "Failed to load notifications.";

    state.notifications = [];
  }
)

// =====================================================
// MARK NOTIFICATION READ
// =====================================================

.addCase(
  markNotificationRead.fulfilled,
  (state, action) => {
    const notificationId = action.payload;

    state.notifications = state.notifications.map(
      (notification) =>
        notification.notification_Id === notificationId
          ? {
              ...notification,
              is_Read: true,
            }
          : notification
    );
  }
)

      .addCase(fetchTimesheet.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to load timesheet.";

        state.tasks = [];
      });
  },
});

export const { clearTimesheet } = timesheetSlice.actions;

export default timesheetSlice.reducer;