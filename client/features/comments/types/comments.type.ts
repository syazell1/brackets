import { addPostInputSchema } from "client/features/posts/schemas/posts.schema"
import { z } from "zod"

export interface CommentsData {
  id: string,
  content: string,
  likes_count: number,
  created_at: string,
  owner: Owner
}

interface Owner {
  id: string,
  username: string
}


export type AddCommentInput = z.infer<typeof addPostInputSchema>;

export type UpdateCommentInput = z.infer<typeof addPostInputSchema>;
