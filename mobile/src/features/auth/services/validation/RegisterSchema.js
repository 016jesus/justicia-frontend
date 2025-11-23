import { z } from 'zod';
import { 
    EmailSchema, 
    PasswordSchema, 
    DocumentNumberSchema, 
    BirthDateSchema,
    DocumentTypeSchema,
    NameSchema,
    OptionalNameSchema
} from './primitives';

// Esquema para el Paso 1: Identificación
export const StepOneSchema = z.object({
    documentType: DocumentTypeSchema,
    documentNumber: DocumentNumberSchema,
    birthDate: BirthDateSchema.transform(
      (val) => (val instanceof Date) ? val.toISOString().split('T')[0] : val
    ), 
}).superRefine((data, ctx) => {
    if (!data.documentType || !data.documentNumber || !data.birthDate) {
        ctx.addIssue({ 
            code: z.ZodIssueCode.custom, 
            path: ['step'], 
            message: 'Complete todos los campos de identificación para continuar.'
        });
    }
});

// Esquema para el Paso 2: Datos Personales y Cuenta
export const StepTwoSchema = z.object({
    firstName: NameSchema,
    middleName: OptionalNameSchema,
    firstLastName: NameSchema,
    secondLastName: OptionalNameSchema,
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
}).superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['confirmPassword'], 
            message: 'Las contraseñas no coinciden.',
        });
    }
});

// Esquema completo (para el submit final)
export const FullRegistrationSchema = StepOneSchema.merge(StepTwoSchema);
