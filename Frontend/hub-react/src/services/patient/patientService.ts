import api from "../axiosInstance";
import type {
    CreatePatientDto,
    Patient,
    UpdatePatientDto,
} from "../../types/patient";

export const patientService = {
    async getAllPatients(): Promise<Patient[]> {
        const response = await api.get<Patient[]>("/patients");
        console.log("response ", response);
        return response.data;
    },

    async getPatientById(id: number): Promise<Patient> {
        const response = await api.get<Patient>(`/patients/${id}`);
        return response.data;
    },

    async createPatient(patient: CreatePatientDto): Promise<Patient> {
        const response = await api.post<Patient>("/patients", patient);
        return response.data;
    },

    async updatePatient(
        id: number,
        patient: UpdatePatientDto
    ): Promise<Patient> {
        const response = await api.put<Patient>(`/patients/${id}`, patient);
        return response.data;
    },

    async deletePatient(id: number): Promise<void> {
        await api.delete(`/patients/${id}`);
    },

    async searchPatients(query: string): Promise<Patient[]> {
        const response = await api.get<Patient[]>("/patients/search", {
            params: { query },
        });
        return response.data;
    },
};
