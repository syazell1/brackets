import { z } from "zod"
import { loginSchema, registerSchema } from "../schemas/authSchema"

export interface AuthDetails{
    id: string,
    username: string,
    accessToken: string
}

export type LoginUserInput = z.infer<typeof loginSchema>;

export type RegisterUserInput = z.infer<typeof registerSchema>;