import { z } from "zod";

export const loginSchema = z.object({
    username: z.string()
        .min(4, "Username should be more than 4 characters")
        .max(12, "Username should be less than 12 characters"),
    password: z.string()
        .min(4, "Password should be more than 4 characters")
        .max(12, "Password should be less than 12 characters" ),
})

export const registerSchema = z.object({
    username: z.string()
        .min(4, "Username should be more than 4 characters")
        .max(12, "Username should be less than 12 characters"),
    password: z.string()
        .min(4, "Password should be more than 4 characters")
        .max(12, "Password should be less than 12 characters" ),
})