import { jwtDecode } from "jwt-decode";
import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
} from "@reduxjs/toolkit";
import {
    type AuthState,
    type JwtTokenPayload,
    type LoginRequest,
    type LoginResponse,
} from "../../../types/auth.ts";
import api from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import { API_ROUTES } from "../../../services/apiRoutes.ts";

export const login = createAsyncThunk(
    "auth/login",
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            const { data } = await api.post(API_ROUTES.AUTH.LOGIN, credentials);
            return data;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error("Something went wrong");
            return rejectWithValue(
                err.response?.data?.message || "Login failed"
            );
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await api.post(API_ROUTES.AUTH.LOGOUT);
            localStorage.removeItem("persistedAuth");
            return true;
        } catch (err) {
            return rejectWithValue("Logout failed");
        }
    }
);

const initialState: AuthState = {
    user: null,
    accessToken: null,
    loading: false,
    error: null,
};

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;

            const persisted = localStorage.getItem("persistedAuth");
            const parsed = persisted ? JSON.parse(persisted) : {};
            localStorage.setItem(
                "persistedAuth",
                JSON.stringify({
                    ...parsed,
                    accessToken: action.payload,
                })
            );
        },
        loadPersistedAuth: (state) => {
            console.log("loadPersistedAuth called: ", new Date());
            const stored = localStorage.getItem("persistedAuth");
            if (stored) {
                const { user, accessToken } = JSON.parse(stored);
                state.user = user || null;
                state.accessToken = accessToken || null;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                login.fulfilled,
                (state, action: PayloadAction<LoginResponse>) => {
                    state.loading = false;
                    state.accessToken = action.payload.data.accessToken;
                    const decoded = jwtDecode<JwtTokenPayload>(
                        action.payload.data.accessToken
                    );
                    state.user = {
                        id: decoded.sub,
                        name: decoded.fullName,
                        email: decoded.email,
                        role: decoded.role?.toLowerCase(),
                    };
                    localStorage.setItem(
                        "persistedAuth",
                        JSON.stringify({
                            user: state.user,
                            accessToken: state.accessToken,
                        })
                    );
                }
            )
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                localStorage.removeItem("persistedAuth");
            });
    },
});

export const { setAccessToken, loadPersistedAuth } = authSlice.actions;
export default authSlice.reducer;
