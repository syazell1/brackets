import { z } from 'zod'
import { addPostInputSchema } from '../schemas/posts.schema'

export interface PostsDetails {
  id: string,
  title: string,
  content: string,
  created_at: string,
  likes_count: number,
  comments_count: number,
  owner: PostsOwner
}

interface PostsOwner {
  id: string,
  username: string
}

export type AddPostInput = z.infer<typeof addPostInputSchema>;

export type UpdatePostInput = z.infer<typeof addPostInputSchema>;
