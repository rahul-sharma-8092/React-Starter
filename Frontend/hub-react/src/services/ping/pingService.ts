import type { AxiosResponse } from "axios";
import { API_ROUTES } from "../apiRoutes";
import api from "../axiosInstance";

export const pingService = {
    async getUserPing(): Promise<AxiosResponse> {
        const response = await api.get<string>(API_ROUTES.USER.PING);
        console.log("response ", response);
        return response;
    },

    async getAdminPing(): Promise<AxiosResponse> {
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        console.log("Req with number: ", randomNum);
        const response = await api.get<string>(
            `${API_ROUTES.ADMIN.PING}/${randomNum}`
        );
        return response;
    },
};
