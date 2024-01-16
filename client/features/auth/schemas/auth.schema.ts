import { z } from 'zod'

export const loginInputSchema = z.object({
  username: z.string(),
  password: z.string()
})
