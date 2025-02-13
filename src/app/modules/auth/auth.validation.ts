import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(5, 'Name must be at least 6 characters long'),
    phone: z
      .string({
        required_error: 'Phone number is required',
      })
      .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters long'),
  }),
});

const loginUserZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'email is required',
      })
      .email('Invalid email format'),
    password: z
      .string({
        required_error: 'password is required',
      })
      .min(6, 'Password must be at least 6 characters long'),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'refreshToken is required',
    }),
  }),
});

export const authValidation = {
  createUserZodSchema,
  loginUserZodSchema,
  refreshTokenZodSchema,
};
