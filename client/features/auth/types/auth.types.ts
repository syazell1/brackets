import { z } from 'zod'
import { loginInputSchema, registerInputSchema } from '../schemas/auth.schema'

export interface AuthDetails {
  access_token: String
}

export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>
