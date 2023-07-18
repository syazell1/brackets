import { z } from "zod";

export const addCommentSchema = z.object({
    postId : z.string().optional(),
    content : z.string()
        .min(8, "Comments should be more than 8 characters")
        .max(150, "Comments should be less than 150 characters"),
})

export const updateCommentSchema = addCommentSchema; 