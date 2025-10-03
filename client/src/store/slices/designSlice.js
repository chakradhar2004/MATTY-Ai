import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { designAPI } from '../../services/api';

// Async thunks
export const fetchDesigns = createAsyncThunk(
  'design/fetchDesigns',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await designAPI.getDesigns(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch designs');
    }
  }
);

export const fetchDesign = createAsyncThunk(
  'design/fetchDesign',
  async (designId, { rejectWithValue }) => {
    try {
      const response = await designAPI.getDesign(designId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch design');
    }
  }
);

export const saveDesign = createAsyncThunk(
  'design/saveDesign',
  async (designData, { rejectWithValue }) => {
    try {
      const response = await designAPI.saveDesign(designData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save design');
    }
  }
);

export const updateDesign = createAsyncThunk(
  'design/updateDesign',
  async ({ designId, designData }, { rejectWithValue }) => {
    try {
      const response = await designAPI.updateDesign(designId, designData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update design');
    }
  }
);

export const deleteDesign = createAsyncThunk(
  'design/deleteDesign',
  async (designId, { rejectWithValue }) => {
    try {
      await designAPI.deleteDesign(designId);
      return designId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete design');
    }
  }
);

export const duplicateDesign = createAsyncThunk(
  'design/duplicateDesign',
  async (designId, { rejectWithValue }) => {
    try {
      const response = await designAPI.duplicateDesign(designId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to duplicate design');
    }
  }
);

export const fetchTemplates = createAsyncThunk(
  'design/fetchTemplates',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await designAPI.getTemplates(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch templates');
    }
  }
);

const initialState = {
  designs: [],
  currentDesign: null,
  templates: [],
  loading: false,
  saving: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
  },
};

const designSlice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    setCurrentDesign: (state, action) => {
      state.currentDesign = action.payload;
    },
    clearCurrentDesign: (state) => {
      state.currentDesign = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateCurrentDesign: (state, action) => {
      if (state.currentDesign) {
        state.currentDesign = { ...state.currentDesign, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch designs
      .addCase(fetchDesigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesigns.fulfilled, (state, action) => {
        state.loading = false;
        state.designs = action.payload.designs;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        };
      })
      .addCase(fetchDesigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single design
      .addCase(fetchDesign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDesign = action.payload;
      })
      .addCase(fetchDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Save design
      .addCase(saveDesign.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveDesign.fulfilled, (state, action) => {
        state.saving = false;
        state.currentDesign = action.payload.design;
        // Add to designs list if not already there
        const existingIndex = state.designs.findIndex(d => d._id === action.payload.design._id);
        if (existingIndex >= 0) {
          state.designs[existingIndex] = action.payload.design;
        } else {
          state.designs.unshift(action.payload.design);
        }
      })
      .addCase(saveDesign.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      // Update design
      .addCase(updateDesign.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateDesign.fulfilled, (state, action) => {
        state.saving = false;
        state.currentDesign = action.payload.design;
        // Update in designs list
        const index = state.designs.findIndex(d => d._id === action.payload.design._id);
        if (index >= 0) {
          state.designs[index] = action.payload.design;
        }
      })
      .addCase(updateDesign.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      // Delete design
      .addCase(deleteDesign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.designs = state.designs.filter(d => d._id !== action.payload);
        if (state.currentDesign && state.currentDesign._id === action.payload) {
          state.currentDesign = null;
        }
      })
      .addCase(deleteDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Duplicate design
      .addCase(duplicateDesign.fulfilled, (state, action) => {
        state.designs.unshift(action.payload.design);
      })
      // Fetch templates
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.templates;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setCurrentDesign, 
  clearCurrentDesign, 
  clearError, 
  updateCurrentDesign 
} = designSlice.actions;
export default designSlice.reducer;
