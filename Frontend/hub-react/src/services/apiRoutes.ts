// All API endpoints
export const API_ROUTES = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        REFRESH: "/auth/refresh",
        LOGOUT: "/auth/logout",
        VERIFY_EMAIL: "/auth/verify-email",
    },
    USER: {
        PING: "/user/ping",
    },
    ADMIN: {
        PING: "/admin/ping",
    },
};

// Excluded url from access token refreshing on 401.
export const EXCLUDED_401_URLS = new Set([
    API_ROUTES.AUTH.LOGIN,
    API_ROUTES.AUTH.REGISTER,
    API_ROUTES.AUTH.REFRESH,
    API_ROUTES.AUTH.LOGOUT,
    API_ROUTES.AUTH.VERIFY_EMAIL,
]);
