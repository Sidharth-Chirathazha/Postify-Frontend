import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { useFormState } from 'react-hook-form';

export const loginUser = createAsyncThunk('auth/loginUser', async (data, thunkAPI) => {
  try {
    const response = await axiosInstance.post('user/login/', data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (data, thunkAPI) => {
  try {
    const response = await axiosInstance.post('user/register/', data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('user/get-profile/');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateUser = createAsyncThunk('auth/updateUser', async (updatedUserData, thunkAPI) => {
  try {
    const response = await axiosInstance.patch('user/update-profile/', updatedUserData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.post('user/logout/');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});



const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    userError: null,
    isUpdating: false,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.non_field_errors?.[0] || action.payload.username?.[0] || action.payload.password?.[0] || "Something went wrong";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.email?.[0] || action.payload?.username?.[0] || "Something went wrong";

      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.userError = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.userError = action.payload?.non_field_errors?.[0] || "Something went wrong";
      })
      .addCase(updateUser.pending, (state) => {
        state.isUpdating = true;
        state.userError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.user = action.payload.user;
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.isUpdating = false;
        state.userError = action.payload?.non_field_errors?.[0] || action.payload?.username?.[0] || "Something went wrong";
      })  

  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
