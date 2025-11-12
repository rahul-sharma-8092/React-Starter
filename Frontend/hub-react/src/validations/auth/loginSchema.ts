import { z } from "zod";
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;

export const loginSchema = z.object({
    userName: z.string().email("Please enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            passwordRegex,
            "Must include upper, lower, number & special character"
        ),
});
