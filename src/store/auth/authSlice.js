import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { axiosInstance } from 'utils/axios.util';

const initialState = {
    user: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async ({ email, password }, thunkAPI) => {
        try {
            await axiosInstance.post('/api/user/login', { email, password });
            const response = await axios.get('/api/user/local');
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const verifyLogin = createAsyncThunk(
    'user/local',
    async (arg, thunkAPI) => {
        try {
            const response = await axiosInstance.get('/api/user/local');
            console.log({ response });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (arg, thunkAPI) => {
        try {
            await axiosInstance.get('/api/user/logout');
            return null;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const userSliece = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            console.log({ action });
            state.token = action.payload?.token;
        },
        clearUser: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isLoggedIn = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(verifyLogin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isLoggedIn = true;
            })
            .addCase(verifyLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isLoggedIn = false;
                state.user = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearUser, login } = userSliece.actions;

export default userSliece.reducer;
