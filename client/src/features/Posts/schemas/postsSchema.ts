import { z } from "zod";

export const createPostSchema = z.object({
    title: z.string()
        .min(8, "Title should be more than 8 characters")
        .max(50, "Title should be less than 50 characters"),
    content: z.string()
        .min(8, "Content should be more than 8 characters")
})