import { z } from "zod"
import { userUpdateDetailsSchema } from "../schemas/userSchema"

export interface UserInfo {
    id: string,
    username: string
}

export interface UserDetails extends UserInfo {
    firstName?: string,
    lastName?: string,
    email?: string,
    bio?: string,
    createdAt: string
}

export type UserUpdateDetailsInput = z.infer<typeof userUpdateDetailsSchema>;