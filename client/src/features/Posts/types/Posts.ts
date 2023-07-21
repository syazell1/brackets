import { UserInfo } from "@/features/Users/types/Users";
import { z } from "zod";
import { createPostSchema, updatePostSchema } from "../schemas/postsSchema";

export interface PostDetails {
    id: string,
    title: string,
    content: string, 
    likeCount: number,
    commentCount: number,
    owner: UserInfo,
    createdAt: string 
}

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>