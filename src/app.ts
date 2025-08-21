import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
import { appLimiter } from './app/middlewares/rateLimiter';
import { PaymentController } from './app/modules/Payment/payment.controller';

const app = express();

// Stripe webhook route (express.raw parser)
app.post(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }),
  // Make sure this function returns void or Promise<void>
  async (req: Request, res: Response) => {
    await PaymentController.stripeWebhook(req, res);
  },
);

// Parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }),
);

app.use(appLimiter);

// Routes
app.use('/api/v1', router);

// Health check
app.get('/', async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Server Is Running',
  });
});

// Global middlewares
app.use(globalErrorHandler);
app.use(notFound);

export default app;
