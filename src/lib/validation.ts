import { z } from 'zod';

export const storySchema = z.object({
  content: z.string()
    .trim()
    .min(10, { message: 'Story must be at least 10 characters' })
    .max(5000, { message: 'Story cannot exceed 5000 characters' })
    .refine(
      (val) => !/<script|javascript:|onerror=|on\w+\s*=/i.test(val),
      { message: 'Story contains potentially unsafe content' }
    )
});

export const profileSchema = z.object({
  full_name: z.string()
    .trim()
    .max(100, { message: 'Name cannot exceed 100 characters' })
    .optional(),
  bio: z.string()
    .trim()
    .max(500, { message: 'Bio cannot exceed 500 characters' })
    .optional(),
  state: z.string()
    .trim()
    .max(100, { message: 'State cannot exceed 100 characters' })
    .optional(),
  sport_discipline: z.string()
    .trim()
    .max(100, { message: 'Sport discipline cannot exceed 100 characters' })
    .optional(),
});
