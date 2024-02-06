import { z } from "zod"
import { AddCommentInputSchema } from "../schemas/comments.schema";

export interface CommentsData {
  id: string,
  content: string,
  likes_count: number,
  created_at: string,
  post_id: string,
  owner: Owner
}

interface Owner {
  id: string,
  username: string
}


export type AddCommentInput = z.infer<typeof AddCommentInputSchema>;

export type UpdateCommentInput = z.infer<typeof AddCommentInputSchema>;
