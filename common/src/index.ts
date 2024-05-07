import z from 'zod';

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional()
})

export type SignupSchema = z.infer<typeof signupSchema>

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export type SigninSchema = z.infer<typeof signinSchema>

export const createBlog = z.object({
    title: z.string(),
    content: z.string()
})

export type CreateBlog = z.infer<typeof createBlog>

export const updateBlog = z.object({
    title: z.string(),
    content: z.string(),
    id: z.string()
})

export type UpdateBlog = z.infer<typeof updateBlog>