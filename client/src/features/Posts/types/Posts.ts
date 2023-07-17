import { UserInfo } from "@/features/Users/types/Users";
import { z } from "zod";
import { createPostSchema } from "../schemas/postsSchema";

export interface PostDetails {
    id: string,
    title: string,
    content: string, 
    owner: UserInfo,
    createdAt: string 
}

export type CreatePostInput = z.infer<typeof createPostSchema>;