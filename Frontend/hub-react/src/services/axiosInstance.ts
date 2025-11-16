import { store } from "../redux/store";
import axios, {
    AxiosError,
    type AxiosInstance,
    type AxiosRequestConfig,
    type InternalAxiosRequestConfig,
} from "axios";
import { logout, setAccessToken } from "../redux/features/auth/authSlice";
import { setLoading } from "../redux/features/auth/loadingSlice";
import { API_ROUTES, EXCLUDED_401_URLS } from "./apiRoutes";

const API_BASE =
    (import.meta.env.VITE_API_BASE as string) ||
    "https://localhost:44358/api/v1";

// Use for api call
const api: AxiosInstance = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// Use only for refresh token
const refreshClient = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
type QueuedRequest = {
    resolve: (token: string) => void;
    reject: (err: any) => void;
};
let failedQueue: QueuedRequest[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((p) => {
        if (error) p.reject(error);
        else p.resolve(token as string);
    });
    failedQueue = [];
};

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const state = store.getState();
        const token = state.auth.accessToken;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        store.dispatch(setLoading(true));
        return config;
    },
    (error) => {
        store.dispatch(setLoading(false));
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        store.dispatch(setLoading(false));
        return response;
    },
    async (error: AxiosError) => {
        store.dispatch(setLoading(false));
        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean;
        };

        if (!error.response) return Promise.reject(error);

        const reqApiUrl = originalRequest.url?.toLowerCase() || "";
        const isUrlExcluded = EXCLUDED_401_URLS.has(reqApiUrl);

        if (
            error.response.status === 401 &&
            !originalRequest._retry &&
            !isUrlExcluded
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // Another refresh in progress so, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            resolve(api(originalRequest));
                        },
                        reject,
                    });
                });
            }

            isRefreshing = true;

            try {
                const { data } = await refreshClient.post(
                    API_ROUTES.AUTH.REFRESH
                );
                console.log("Refresh response: ", data);
                const newAccessToken =
                    (data.data && data.data.accessToken) || null;

                if (!newAccessToken) {
                    throw new Error("No access token returned during refresh");
                }

                store.dispatch(setAccessToken(newAccessToken));

                api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

                // Retry pending requests
                processQueue(null, newAccessToken);

                // Update original request header and retry it
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                console.log("Refresh error: ", refreshError);
                store.dispatch(logout());
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
