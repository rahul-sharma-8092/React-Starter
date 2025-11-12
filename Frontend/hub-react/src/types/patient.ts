export interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    dateOfBirth: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    email?: string;
    phoneNumber: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "";
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    medicalHistory?: string;
    allergies?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePatientDto {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: "Male" | "Female" | "Other";
    email?: string;
    phoneNumber: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    bloodGroup?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    medicalHistory?: string;
    allergies?: string;
}

export interface UpdatePatientDto extends CreatePatientDto {
    id: number;
}
