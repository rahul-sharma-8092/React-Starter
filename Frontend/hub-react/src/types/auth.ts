export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface JwtTokenPayload {
    sub: string;
    jti: string;
    fullName: string;
    email: string;
    role: string;
    exp: number;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    data: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface RefreshResponse {
    data: { accessToken: string };
}

export interface UserRegisterDto {
    fullName: string;
    email: string;
    role: number;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
    address: string;
    city: string;
    state: string;
    termsConditions: boolean;
}
