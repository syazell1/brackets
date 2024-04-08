import { z } from 'zod'

export const AddCommentInputSchema = z.object({
  post_id: z.string(),
  content: z.string().min(4).max(100)
}) 
