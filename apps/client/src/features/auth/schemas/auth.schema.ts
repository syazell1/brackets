import { z } from 'zod'

export const loginInputSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(4)
})

export const registerInputSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(4),
  first_name: z.string().min(4),
  last_name: z.string().min(4),
  email: z.string().min(4)
})
