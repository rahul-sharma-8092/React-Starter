import * as z from "zod";
import {
    NAME_REGEX,
    MOBILE_REGEX,
    PASSWORD_REGEX,
    ADDRESS_REGEX,
} from "../regex/regexes";
export const registerSchema = z
    .object({
        fullName: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(50)
            .regex(NAME_REGEX, "Invalid name format"),
        role: z.number(),
        email: z.string().email("Invalid email address"),
        mobileNumber: z
            .string()
            .regex(MOBILE_REGEX, "Enter a valid 10-digit mobile number"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                PASSWORD_REGEX,
                "Must include upper, lower, number & special character"
            ),
        confirmPassword: z.string().min(8, "Confirm password required"),
        address: z
            .string()
            .min(5, "Address too short")
            .regex(ADDRESS_REGEX, "Invalid address format"),
        city: z.string().min(2, "City is required"),
        state: z.string().min(2, "State is required"),
        termsConditions: z.boolean().refine((val) => val === true, {
            message: "You must agree to Terms & Conditions",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
