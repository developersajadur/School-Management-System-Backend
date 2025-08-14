import { z } from 'zod';

const createTeacherValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['admin', 'teacher', 'student']),
    phone: z
      .string()
      .min(5, 'Phone number is too short')
      .max(20, 'Phone number is too long'),

    subjects: z
      .array(z.string().min(1, 'Subject name cannot be empty'))
      .min(1, 'At least one subject is required'),
    classes: z
      .array(z.string().min(1, 'Class name cannot be empty'))
      .min(1, 'At least one class is required'),

    address: z.string().min(1, 'Address is required'),

    joiningDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid joining date',
    }),
  }),
});

const updateTeacherValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Invalid email format').optional(),
    phone: z
      .string()
      .min(5, 'Phone number is too short')
      .max(20, 'Phone number is too long')
      .optional(),

    subjects: z
      .array(z.string().min(1, 'Subject name cannot be empty'))
      .min(1, 'At least one subject is required')
      .optional(),
    classes: z
      .array(z.string().min(1, 'Class name cannot be empty'))
      .min(1, 'At least one class is required')
      .optional(),

    address: z.string().min(1, 'Address is required').optional(),

    joiningDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid joining date',
      })
      .optional(),
  }),
});

export const TeacherValidation = {
  createTeacherValidation,
  updateTeacherValidation,
};
