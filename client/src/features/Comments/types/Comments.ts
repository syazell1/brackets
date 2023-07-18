import { UserInfo } from "@/features/Users/types/Users"
import { z } from "zod"
import { addCommentSchema } from "../schemas/commentsSchema"

export interface CommentDetails {
    id: string,
    content: string,
    postId: string, 
    owner: UserInfo, 
    createdAt: string
}

export type AddCommentInput = z.infer<typeof addCommentSchema>;