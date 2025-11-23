import { z } from 'zod';

// --- Requisito: Correo Electrónico (Formato válido y requerido) ---
export const EmailSchema = z.string()
   .email("El formato del correo electrónico es inválido.")
   .max(255, "El correo no debe exceder los 255 caracteres.")
   .nonempty("El correo electrónico es obligatorio.");

// --- Requisito: Contraseña Fuerte (Recomendación de seguridad) ---
// Se añaden validaciones robustas (longitud, mayúsculas, minúsculas, número, especial)
export const PasswordSchema = z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .regex(/[A-Z]+/, "Debe contener al menos una letra mayúscula.")
    .regex(/[a-z]+/, "Debe contener al menos una letra minúscula.")
    .regex(/\d+/, "Debe contener al menos un número.")
    .regex(/[@$!%*#?&]+/, "Debe contener al menos un carácter especial (@, $,!, %, *, #,?, &).")
    .nonempty("La contraseña es obligatoria.");

// --- Requisito: Número de Documento (Solo dígitos, longitud 5-10) ---
export const DocumentNumberSchema = z.string()
   .regex(/^\d+$/, "El número de documento solo debe contener dígitos (0-9), sin letras.")
   .min(5, "El número de documento debe tener al menos 5 dígitos.")
   .max(10, "El número de documento no debe exceder los 10 dígitos.")
   .nonempty("El número de documento es requerido.");

// --- Requisito: Fecha de Nacimiento (No menor a 1900, No mayor a la fecha actual) ---
const MIN_DATE = new Date('1910-01-01');
const MAX_DATE = new Date(); // Fecha actual

export const BirthDateSchema = z.preprocess(
    (arg) => {
        if (!arg) return undefined;
        const date = new Date(arg);
        return isNaN(date.getTime()) ? undefined : date;
    },    // El resto del esquema (z.date()) se mantiene igual
    z.date({
        required_error: "La fecha de nacimiento es obligatoria.",
        invalid_type_error: "Formato de fecha inválido."
    })
    .min(MIN_DATE, `La fecha no puede ser anterior al año 1900.`)
    .max(MAX_DATE, "La fecha de nacimiento no puede ser una fecha futura.")
);

// Campos de nombres/apellidos
export const NameSchema = z.string().trim().min(2, "Mínimo 2 caracteres.").max(50, "Máximo 50 caracteres.").nonempty("Este campo es obligatorio.");
export const OptionalNameSchema = z.string().trim().max(50, "Máximo 50 caracteres.").optional().nullable();

// Tipo de documento (para usar en el Step 1)
export const DocumentTypeSchema = z.enum(['CC', 'CE', 'PA', 'TI'], {
    errorMap: () => ({ message: "Debe seleccionar un tipo de documento." })
});