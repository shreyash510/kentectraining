import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosApi';
import {
  getDBConnection,
  createTable,
  getAllItems,
  insertItem,
  clearAllItems,
} from '../../services/database';

// Fetch content from SQLite
export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (_, {rejectWithValue}) => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      const items = await getAllItems(db);
      return items;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch content');
    }
  },
);

// Fetch from API and save to SQLite
export const fetchAndSaveContent = createAsyncThunk(
  'content/fetchAndSaveContent',
  async (url: string, {rejectWithValue}) => {
    try {
      const response = await axiosInstance.get(url);
      const data = response.data;

      const db = await getDBConnection();
      await createTable(db);
      await clearAllItems(db);
      await insertItem(db, data);

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch and save content');
    }
  },
);
