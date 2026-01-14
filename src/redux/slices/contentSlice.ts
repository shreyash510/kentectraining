import {createSlice} from '@reduxjs/toolkit';
import {fetchContent, fetchAndSaveContent} from '../actions/contentActions';
import type {RootState} from '../store';

export interface ContentState {
  data: any;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  data: null,
  isLoading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContent: (state, action) => {
      state.data = action.payload;
      state.error = null;
    },
    clearContent: state => {
      state.data = null;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch from SQLite
      .addCase(fetchContent.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch content';
      })
      // Fetch from API and save to SQLite
      .addCase(fetchAndSaveContent.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAndSaveContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchAndSaveContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch and save content';
      });
  },
});

export const {setContent, clearContent, clearError} = contentSlice.actions;
export default contentSlice;

// Selectors
export const selectContent = (state: RootState) => state.content.data;
export const selectContentLoading = (state: RootState) => state.content.isLoading;
export const selectContentError = (state: RootState) => state.content.error;
