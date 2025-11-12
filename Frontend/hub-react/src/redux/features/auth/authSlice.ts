import { jwtDecode } from "jwt-decode";
import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
} from "@reduxjs/toolkit";
import {
    type AuthState,
    type JwtTokenPayload,
    type LoginResponse,
    type RefreshResponse,
} from "../../../types/auth.ts";
import api from "../../../services/axiosInstance";
import { type RootState } from "../../store";
import { toast } from "react-toastify";

// --- Async Actions ---
export const login = createAsyncThunk(
    "auth/login",
    async (
        credentials: { userName: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const { data } = await api.post("/auth/login", credentials);
            return data; // { accessToken, refreshToken }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error("Something went wrong");
            return rejectWithValue(
                err.response?.data?.message || "Login failed"
            );
        }
    }
);

export const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const refresh = state.auth.refreshToken;
        if (!refresh) return rejectWithValue("No refresh token");

        try {
            const { data } = await api.post("/auth/refresh", {
                token: refresh,
            });
            return data; // { accessToken }
        } catch {
            return rejectWithValue("Token refresh failed");
        }
    }
);

// --- Initial State ---
const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,
};

// --- Slice ---
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem("persistedAuth");
        },
        loadPersistedAuth: (state) => {
            const stored = localStorage.getItem("persistedAuth");
            if (stored) {
                const { user, accessToken, refreshToken } = JSON.parse(stored);
                state.user = user;
                state.accessToken = accessToken;
                state.refreshToken = refreshToken;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Login ---
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                login.fulfilled,
                (state, action: PayloadAction<LoginResponse>) => {
                    state.loading = false;
                    state.accessToken = action.payload.data.accessToken;
                    state.refreshToken = action.payload.data.refreshToken;
                    const decoded = jwtDecode<JwtTokenPayload>(
                        action.payload.data.accessToken
                    );
                    state.user = {
                        id: decoded.sub,
                        name: decoded.fullName,
                        email: decoded.email,
                        role: decoded.role,
                    };
                    localStorage.setItem(
                        "persistedAuth",
                        JSON.stringify({
                            user: state.user,
                            accessToken: state.accessToken,
                            refreshToken: state.refreshToken,
                        })
                    );
                }
            )
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // --- Token Refresh ---
            .addCase(
                refreshToken.fulfilled,
                (state, action: PayloadAction<RefreshResponse>) => {
                    state.accessToken = action.payload.data.accessToken;
                    localStorage.setItem(
                        "persistedAuth",
                        JSON.stringify({
                            ...state,
                            accessToken: action.payload.data.accessToken,
                        })
                    );
                }
            );
    },
});

export const { logout, loadPersistedAuth } = authSlice.actions;
export default authSlice.reducer;
