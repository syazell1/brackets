import { z } from 'zod'
import { loginInputSchema } from '../schemas/auth.schema'

export interface AuthDetails {
  access_token: String
}

export type LoginInput = z.infer<typeof loginInputSchema>;
