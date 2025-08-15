import { z } from 'zod';

const sendToStudentSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, 'Student ID is required'),
    message: z.string().min(1, 'Message cannot be empty'),
  }),
});

const sendToMultipleStudentsSchema = z.object({
  body: z.object({
    studentIds: z
      .array(z.string().min(1))
      .min(1, 'At least one student ID is required'),
    message: z.string().min(1, 'Message cannot be empty'),
  }),
});

const sendToGuardiansSchema = z.object({
  body: z.object({
    studentIds: z
      .array(z.string().min(1))
      .min(1, 'At least one student ID is required'),
    message: z.string().min(1, 'Message cannot be empty'),
  }),
});

const sendToClassSchema = z.object({
  body: z.object({
    className: z.string().min(1, 'Class name is required'),
    section: z.string().optional(),
    message: z.string().min(1, 'Message cannot be empty'),
  }),
});

export const messageValidation = {
  sendToStudentSchema,
  sendToMultipleStudentsSchema,
  sendToGuardiansSchema,
  sendToClassSchema,
};
