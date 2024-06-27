import { z } from 'zod'
import { loginInputSchema, registerInputSchema } from '../schemas/auth.schema'

interface UserInfo {
  id: string,
  username: string
}

export interface AuthInfo extends UserInfo {
  access_token : string
}

export interface AuthResponse {
  access_token : string,
  id: string,
  username: string
}

export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>
