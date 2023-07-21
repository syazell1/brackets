import { z } from "zod";

export const userUpdateDetailsSchema = z.object({
    username: z.string()
        .min(4)
        .max(12),
    firstName: z.string()
        .min(4)
        .optional(),
    lastName:  z.string()
        .min(4)
        .optional(),
    email: z.string()
        .email()
        .optional(),
    bio: z.string()
        .min(1)
        .max(50)
        .optional()
});