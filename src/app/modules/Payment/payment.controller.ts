/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import Stripe from 'stripe';
import { PaymentService } from './payment.service';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import config from '../../config';
import { tokenDecoder } from '../Auth/auth.utils';

const createIntent = catchAsync(async (req: Request, res: Response) => {
  const decoded = tokenDecoder(req);
  const { amount, currency } = req.body;
  const data = await PaymentService.createPaymentIntent({
    studentId: decoded.userId,
    amount,
    currency,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment intent created',
    data,
  });
});

const stripeWebhook = async (req: Request, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'] as string | undefined;
    const secret = config.stripe.webhook_secret as string;

    let event: Stripe.Event;
    if (!config.stripe.secret_key) {
      event = JSON.parse(req.body.toString()); // dev fallback
    } else {
      const stripe = new Stripe(config.stripe.secret_key as string);
      event = stripe.webhooks.constructEvent(req.body, sig!, secret);
    }

    const result = await PaymentService.handleStripeWebhook(event);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

const getPayments = catchAsync(async (req: Request, res: Response) => {
  const data = await PaymentService.getPayments(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payments retrieved successfully',
    data,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await PaymentService.getPaymentById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment retrieved successfully',
    data,
  });
});

export const PaymentController = {
  createIntent,
  stripeWebhook,
  getPayments,
  getPaymentById,
};
