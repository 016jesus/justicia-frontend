import { z } from 'zod';
import { EmailSchema, PasswordSchema } from './primitives';

export const LoginSchema = z.object({
    email: EmailSchema,
    password: PasswordSchema,
});