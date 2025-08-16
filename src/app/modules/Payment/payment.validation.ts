import { z } from 'zod';

const createIntentValidation = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be > 0'),
    currency: z.string().min(3).max(10).default('usd'),
  }),
});

export const PaymentValidation = {
  createIntentValidation,
};
