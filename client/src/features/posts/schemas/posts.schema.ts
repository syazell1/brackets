import { z } from 'zod'

export const addPostInputSchema = z.object({
  title: z.string().min(4),
  content: z.string().min(4)
}) 
