import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTasks, getTaskProjects } from "@/services/taskService";
import axiosClient from "@/services/axiosClient";

const getProjectTitle = (item = {}) =>
  item.projectTitle ||
  item.project_Title ||
  item.projectName ||
  item.project_Name ||
  item.ProjectTitle ||
  item.Project_Title ||
  item.ProjectName ||
  item.Project_Name ||
  item.title ||
  item.name ||
  "";

const getClientTitle = (item = {}) =>
  item.clientTitle ||
  item.client_Title ||
  item.clientName ||
  item.client_Name ||
  item.ClientTitle ||
  item.Client_Title ||
  item.ClientName ||
  item.Client_Name ||
  item.client ||
  "";

export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (params, { rejectWithValue }) => {
    try {
      const data = await getTasks({
        empId: params.empId,
        userType: params.userType,
        startDate: params.startDate,
        endDate: params.endDate,
        searchText: params.searchText,
        projectId: params.projectId,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
      });

      return data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        "Failed to load tasks."
      );
    }
  }
);

export const fetchTaskProjects = createAsyncThunk(
  "task/fetchTaskProjects",
  async ({ empId, userType }, { rejectWithValue }) => {
    try {
      const data = await getTaskProjects({ empId, userType });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        "Failed to load projects."
      );
    }
  }
);

export const fetchEmployeeNames = createAsyncThunk(
  "task/fetchEmployeeNames",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/employee/names");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        "Failed to load employee names."
      );
    }
  }
);

export const fetchTaskTemplates = createAsyncThunk(
  "task/fetchTaskTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/Task/template-list");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        "Failed to load task templates."
      );
    }
  }
);

export const createTaskTemplate = createAsyncThunk(
  "task/createTaskTemplate",
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/Task/template",
        templateData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        "Failed to create task template."
      );
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  "task/fetchTaskById",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        `/Task/${taskId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.title ||
          error?.message ||
          "Failed to load task."
      );
    }
  }
);

export const fetchAllProjects = createAsyncThunk(
  "task/fetchAllProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(
        "/project/all",
        {
          params: {
            pageNumber: 1,
            pageSize: 2000,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to load projects."
      );
    }
  }
);

export const rescheduleTask = createAsyncThunk(
  "task/rescheduleTask",
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/Task/reschedule",
        requestData
      );

      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message ||
        "Failed to reschedule task."
      );
    }
  }
);

// =====================================================
// DELETE TASK
// DELETE /api/v1/Task/{taskId}
// =====================================================

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async ({ taskId, deletedBy, deleteReason }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.delete(
        `/Task/${taskId}`,
        {
          data: {
            deletedBy,
            deleteReason,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to delete task."
      );
    }
  }
);

const initialState = {
  tasks: [],

  // =====================================================
  // SELECTED TASK
  // =====================================================

  selectedTask: null,
  selectedTaskLoading: false,
  selectedTaskError: null,

  // =====================================================
  // TASK DETAILS - CREATE / UPDATE PAGE
  // =====================================================

  taskDetails: null,
  taskDetailsLoading: false,
  taskDetailsError: null,

  // =====================================================
  // PAGINATION
  // =====================================================

  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,

  // =====================================================
  // PROJECTS
  // =====================================================

  projects: [],
  projectsLoading: false,
  projectsError: null,

  // =====================================================
  // EMPLOYEES
  // =====================================================

  employeeNames: [],
  employeeNamesLoading: false,
  employeeNamesError: null,

  // =====================================================
  // TASK TEMPLATES
  // =====================================================

  taskTemplates: [],
  taskTemplatesLoading: false,
  taskTemplatesError: null,

  createTemplateLoading: false,
  createTemplateError: null,

  // =====================================================
  // GENERAL
  // =====================================================

  loading: false,
  error: null,

  // =====================================================
  // RESCHEDULE
  // =====================================================

  rescheduleLoading: false,
  rescheduleError: null,

  // =====================================================
  // DELETE
  // =====================================================

  deleteLoading: false,
  deleteError: null,
};

const taskSlice = createSlice({
  name: "task",

  initialState,

  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
      state.totalCount = 0;
      state.pageNumber = 1;
      state.pageSize = 10;
      state.totalPages = 0;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
  builder
    
    .addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(fetchTasks.fulfilled, (state, action) => {
  state.loading = false;

  state.tasks = (action.payload?.tasks || []).map((item) => ({
    id: item.task_Id,
    title: item.task_Title || "",

    projectId: Number(
      item.projectId ??
      item.ProjectId ??
      item.project_ID ??
      0
    ),

    projectTitle: getProjectTitle(item),
    projectCode: item.projectCode || "",
    priority: item.tskpriority || "",

    employees: item.employee_Names
      ? item.employee_Names
          .split(",")
          .map((name) => name.trim())
      : [],

    startDate: item.start_Date_Formatted || "",
    endDate: item.end_Date_Formatted || "",
  }));

  state.totalCount = action.payload?.totalCount || 0;
  state.pageNumber = action.payload?.pageNumber || 1;
  state.pageSize = action.payload?.pageSize || 10;
  state.totalPages = action.payload?.totalPages || 0;
})

    .addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload || "Failed to load tasks.";
      state.tasks = [];
    })

    
    .addCase(fetchTaskProjects.pending, (state) => {
      state.projectsLoading = true;
      state.projectsError = null;
    })

    .addCase(fetchTaskProjects.fulfilled, (state, action) => {
  state.projectsLoading = false;
  state.projectsError = null;

  const payload = action.payload;
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.projects)
      ? payload.projects
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.projects)
          ? payload.data.projects
          : Array.isArray(payload?.result)
            ? payload.result
            : Array.isArray(payload?.items)
              ? payload.items
              : [];

  state.projects = list;
})

    .addCase(fetchTaskProjects.rejected, (state, action) => {
      state.projectsLoading = false;
      state.projectsError =
        action.payload || "Failed to load projects.";

      state.projects = [];
    })

    .addCase(fetchEmployeeNames.pending, (state) => {
  state.employeeNamesLoading = true;
  state.employeeNamesError = null;
})

.addCase(fetchEmployeeNames.fulfilled, (state, action) => {
  state.employeeNamesLoading = false;
  state.employeeNamesError = null;

  state.employeeNames = action.payload || [];
})

.addCase(fetchEmployeeNames.rejected, (state, action) => {
  state.employeeNamesLoading = false;

  state.employeeNamesError =
    action.payload || "Failed to load employee names.";

  state.employeeNames = [];
})

    // -------------------------------------------------
    // TASK TEMPLATE LIST
    // -------------------------------------------------

    .addCase(fetchTaskTemplates.pending, (state) => {
      state.taskTemplatesLoading = true;
      state.taskTemplatesError = null;
    })

    .addCase(fetchTaskTemplates.fulfilled, (state, action) => {
      state.taskTemplatesLoading = false;
      state.taskTemplatesError = null;

      state.taskTemplates = action.payload?.tasks || [];
    })

    .addCase(fetchTaskTemplates.rejected, (state, action) => {
      state.taskTemplatesLoading = false;

      state.taskTemplatesError =
        action.payload || "Failed to load task templates.";

      state.taskTemplates = [];
    })

    // -------------------------------------------------
    // CREATE TASK TEMPLATE
    // -------------------------------------------------

    .addCase(createTaskTemplate.pending, (state) => {
      state.createTemplateLoading = true;
      state.createTemplateError = null;
    })

    .addCase(createTaskTemplate.fulfilled, (state) => {
      state.createTemplateLoading = false;
      state.createTemplateError = null;
    })

    .addCase(createTaskTemplate.rejected, (state, action) => {
      state.createTemplateLoading = false;

      state.createTemplateError =
        action.payload || "Failed to create task template.";
    })

    .addCase(fetchTaskById.pending, (state) => {
  state.selectedTaskLoading = true;
  state.selectedTaskError = null;
  state.selectedTask = null;

  state.taskDetailsLoading = true;
  state.taskDetailsError = null;
  state.taskDetails = null;
})

.addCase(fetchTaskById.fulfilled, (state, action) => {
  state.selectedTaskLoading = false;
  state.selectedTaskError = null;

  const item = action.payload;

  state.taskDetails = item;

  state.selectedTask = {
    id: item.taskId,
    title: item.taskTitle || "",
    priority: item.taskPriority || "",

    projectId: item.projectId,
    projectCode: item.projectCode || "",
    projectTitle: getProjectTitle(item),
    projectName: getProjectTitle(item),
    clientName: getClientTitle(item),
    clientTitle: getClientTitle(item),

    empIds: item.empIds || "",
    startDate: item.startDate || "",
    endDate: item.endDate || "",
    status: item.status,

    employeeAllocations:
      item.employeeAllocations || [],
  };
})

.addCase(fetchTaskById.rejected, (state, action) => {
  state.selectedTaskLoading = false;
  state.selectedTaskError =
    action.payload || "Failed to load task.";

  state.selectedTask = null;

  state.taskDetailsLoading = false;
  state.taskDetailsError =
    action.payload || "Failed to load task.";

  state.taskDetails = null;
})

.addCase(fetchAllProjects.pending, (state) => {
  state.projectsLoading = true;
  state.projectsError = null;
})

.addCase(fetchAllProjects.fulfilled, (state, action) => {
  state.projectsLoading = false;
  state.projectsError = null;

  state.projects =
    action.payload?.projects || [];
})

.addCase(fetchAllProjects.rejected, (state, action) => {
  state.projectsLoading = false;

  state.projectsError =
    action.payload ||
    "Failed to load projects.";

  state.projects = [];
})

// -------------------------------------------------
// DELETE TASK
// -------------------------------------------------

.addCase(deleteTask.pending, (state) => {
  state.deleteLoading = true;
  state.deleteError = null;
})

.addCase(deleteTask.fulfilled, (state, action) => {
  state.deleteLoading = false;
  state.deleteError = null;

  // Remove deleted task immediately from current Redux list
  const deletedTaskId = action.meta.arg.taskId;

  state.tasks = state.tasks.filter(
    (task) => String(task.id) !== String(deletedTaskId)
  );

  if (state.totalCount > 0) {
    state.totalCount -= 1;
  }
})

.addCase(deleteTask.rejected, (state, action) => {
  state.deleteLoading = false;

  state.deleteError =
    action.payload || "Failed to delete task.";
})

.addCase(rescheduleTask.pending, (state) => {
  state.rescheduleLoading = true;
  state.rescheduleError = null;
})

.addCase(rescheduleTask.fulfilled, (state) => {
  state.rescheduleLoading = false;
  state.rescheduleError = null;
})

.addCase(rescheduleTask.rejected, (state, action) => {
  state.rescheduleLoading = false;

  state.rescheduleError =
    action.payload ||
    "Failed to reschedule task.";
});

},
});

export const { clearTasks } = taskSlice.actions;

export default taskSlice.reducer;