import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const UserInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'officer']),
})

export const UserUpdateSchema = z.object({
  name: z.string().optional(),
  role: z.enum(['admin', 'officer']).optional(),
  is_active: z.boolean().optional(),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type UserInput = z.infer<typeof UserInputSchema>
export type UserUpdate = z.infer<typeof UserUpdateSchema>
