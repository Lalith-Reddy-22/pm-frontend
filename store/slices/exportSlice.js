import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/services/axiosClient";

// =====================================================
// POST EXPORT
// POST /api/v1/export
// =====================================================

export const exportFile = createAsyncThunk(
  "export/exportFile",
  async (
  {
    fileName,
    format,
    columns,
    data,
    sections = [],
  },
  { rejectWithValue }
) => {
    try {
      const response = await axiosClient.post(
        "/export",
        {
    fileName,
    format,
    columns,
    data,
    sections,
  },
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);

      // =====================================================
      // COPY
      // =====================================================
      if (format === "copy") {
        const text = await blob.text();

        await navigator.clipboard.writeText(text);

        return {
          success: true,
          fileName,
          format,
        };
      }

      // =====================================================
      // PRINT
      // =====================================================
      if (format === "print") {
        const html = await blob.text();

        const printWindow = window.open(
          "",
          "_blank",
          "width=1000,height=700"
        );

        if (!printWindow) {
          throw new Error(
            "Unable to open print window. Please allow popups."
          );
        }

        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();

        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };

        return {
          success: true,
          fileName,
          format,
        };
      }

      // =====================================================
      // PDF / CSV
      // =====================================================
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${fileName}.${format}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      return {
        success: true,
        fileName,
        format,
      };
    } catch (error) {
      console.error("EXPORT ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("HEADERS:", error.response?.headers);
      console.error("DATA:", error.response?.data);

      let errorMessage = "Failed to export file.";

      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();

          console.error(
            "BLOB ERROR RESPONSE:",
            text
          );

          const parsed = JSON.parse(text);

          errorMessage =
            parsed?.message ||
            parsed?.title ||
            parsed?.error ||
            text ||
            errorMessage;
        } catch {
          console.error(
            "Could not parse blob error response."
          );
        }
      } else {
        errorMessage =
          error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          errorMessage;
      }

      return rejectWithValue(errorMessage);
    }
  }
);

const exportSlice = createSlice({
  name: "export",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    clearExportState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(exportFile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(exportFile.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })

      .addCase(exportFile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to export file.";
        state.success = false;
      });
  },
});

export const { clearExportState } = exportSlice.actions;

export default exportSlice.reducer;