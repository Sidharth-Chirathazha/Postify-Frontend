import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { logout } from './authSlice';


function updateCommentStatus(comments, commentId, isActive) {
  for (let comment of comments) {
    if (comment.id === commentId) {
      comment.is_active = isActive;
      return true;
    }
    if (comment.replies && comment.replies.length > 0) {
      const updated = updateCommentStatus(comment.replies, commentId, isActive);
      if (updated) return true;
    }
  }
  return false;
}



export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async ({page = 1, search='', isActive=''}, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (search) params.append('search', search);
      if (isActive !== '') params.append('is_active', isActive);
      const response = await axiosInstance.get(`admin/users/?${params.toString()}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const toggleUserStatus = createAsyncThunk(
  'admin/toggleUserStatus',
  async (userId, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`admin/users/${userId}/toggle-status/`);
      return { id: userId, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchAdminBlogs = createAsyncThunk(
  'blogs/fetchAdminBlogs',
  async ({url = 'admin/blogs/', search='', isActive=''}, thunkAPI) => {
    try {

      let config = {};
      
      if (!url.includes('?')) {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (isActive !== '') params.append('is_active', isActive);
        config.params = params;
      }
      const relativeUrl = url.replace(/^\/?api\//, '');

      const response = await axiosInstance.get(relativeUrl, config);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching blogs');
    }
  }
);


export const toggleBlogStatus = createAsyncThunk(
  'admin/toggleBlogStatus',
  async (blogId, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`admin/blogs/${blogId}/toggle_active/`);
      return { id: blogId, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const toggleCommentStatus = createAsyncThunk(
  'admin/toggleCommentStatus',
  async (commentId, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`admin/comments/${commentId}/toggle-status/`);
      return { id: commentId, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    count: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    statusUpdating: false,
    adminBlogs:[],
    next:null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.users = [];
        state.adminBlogs = [];
        state.next = null;
        state.loading = false;
        state.error = null;
        state.statusUpdating = false;
        state.count = 0;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.results;
        state.count = action.payload.count;
        state.totalPages = Math.ceil(action.payload.count / 10); 
        state.currentPage = action.meta.arg || 1;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || "Failed to fetch users";
      })
      .addCase(toggleUserStatus.pending, (state) => {
        state.statusUpdating = true;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = {
            ...state.users[index],
            is_active: updatedUser.is_active
          };
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.statusUpdating = false;
        state.error = action.payload?.detail || "Failed to update user status";
      })
      .addCase(fetchAdminBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBlogs.fulfilled, (state, action) => {
        const { results, next } = action.payload;
      
        const url = action.meta.arg?.url || 'admin/blogs/';
        const isFirstPage = url.includes('page=1') || url === 'admin/' || url === 'admin/blogs/';

      
        if (isFirstPage) {
          state.adminBlogs = results;
        } else {
          const existingIds = new Set(state.adminBlogs.map((b) => b.id));
          const newBlogs = results.filter((b) => !existingIds.has(b.id));
          state.adminBlogs = state.adminBlogs.concat(newBlogs);
        }
      
        state.next = next;
        state.loading = false;
      })
      
      .addCase(fetchAdminBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleBlogStatus.pending, (state) => {
        state.statusUpdating = true;
      })
      .addCase(toggleBlogStatus.fulfilled, (state, action) => {
        const updatedBlog = action.payload;
        const index = state.adminBlogs.findIndex(blog => blog.id === updatedBlog.id);
        if (index !== -1) {
          state.adminBlogs[index].is_active = updatedBlog.is_active;
        }
      })
      .addCase(toggleBlogStatus.rejected, (state, action) => {
        state.statusUpdating = false;
        state.error = action.payload?.detail || "Failed to update blog status";
      })
      .addCase(toggleCommentStatus.fulfilled, (state, action) => {
        const { id, is_active } = action.payload;
      
        for (let blog of state.adminBlogs) {
          const updated = updateCommentStatus(blog.comments, id, is_active);
          if (updated) break;
        }
      });
      
      
      
  },
});

export default adminSlice.reducer;
