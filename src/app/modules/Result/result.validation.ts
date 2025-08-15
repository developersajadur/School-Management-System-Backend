import { z } from 'zod';

const createResultValidation = z.object({
  body: z.object({
    student: z.string().min(1, 'Student ID is required'),
    term: z.string().min(1, 'Term is required'),
    year: z.number().min(2000).max(2100),
    subjects: z
      .array(
        z.object({
          subject: z.string().min(1, 'Subject name is required'),
          marks: z.number().min(0).max(100),
        }),
      )
      .min(1, 'At least one subject is required'),
    remarks: z.string().optional(),
  }),
});

const updateResultValidation = z.object({
  body: z.object({
    term: z.string().optional(),
    year: z.number().min(2000).max(2100).optional(),
    subjects: z
      .array(
        z.object({
          subject: z.string().min(1),
          marks: z.number().min(0).max(100),
        }),
      )
      .optional(),
    remarks: z.string().optional(),
  }),
});

export const resultValidation = {
  createResultValidation,
  updateResultValidation,
};
