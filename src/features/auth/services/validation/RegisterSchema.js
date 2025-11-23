import { z } from 'zod';
import { 
    EmailSchema, 
    PasswordSchema, 
    DocumentNumberSchema, 
    BirthDateSchema, // <-- Lo importamos (ya es requerido por defecto)
    DocumentTypeSchema,
    NameSchema,
    OptionalNameSchema
} from './primitives';

// Esquema para el Paso 1: Identificación
export const StepOneSchema = z.object({
    documentType: DocumentTypeSchema,
    documentNumber: DocumentNumberSchema,
    
    // --- LÍNEA CORREGIDA ---
    // Simplemente borramos el ".nonempty(...)"
    // También ajusté el transform a .split('T')[0] para que envíe solo 'YYYY-MM-DD'
    birthDate: BirthDateSchema.transform(
      (val) => (val instanceof Date) ? val.toISOString().split('T')[0] : val
    ), 
}).superRefine((data, ctx) => {
    // ... (tu lógica de superRefine está bien)
    if (!data.documentType || !data.documentNumber || !data.birthDate) { // <-- Añadí !data.birthDate aquí
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
    // ... (tu lógica de superRefine está bien)
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