import Stripe from 'stripe';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Payment } from './payment.model';
import { Student } from '../Student/student.model';
import QueryBuilder from '../../builders/QueryBuilder';
import config from '../../config';

const stripe = new Stripe(config.stripe.secret_key as string);

const createPaymentIntent = async (payload: {
  studentId: string;
  amount: number;
  currency?: string;
}) => {
  const student = await Student.findOne({
    user: payload.studentId,
    isDeleted: false,
  });
  if (!student || student.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(payload.amount * 100),
    currency: payload?.currency || 'usd',
    metadata: { studentId: student._id.toString() },
  });

  const payment = await Payment.create({
    student: student._id,
    amount: payload.amount,
    currency: payload.currency,
    status: 'pending',
    transactionId: intent.id,
  });

  return {
    paymentId: payment._id,
    clientSecret: intent.client_secret,
  };
};

const handleStripeWebhook = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      await Payment.findOneAndUpdate(
        { transactionId: pi.id },
        { status: 'succeeded' },
        { new: true },
      );
      break;
    }
    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent;
      await Payment.findOneAndUpdate(
        { transactionId: pi.id },
        { status: 'failed' },
        { new: true },
      );
      break;
    }
    case 'payment_intent.canceled': {
      const pi = event.data.object as Stripe.PaymentIntent;
      await Payment.findOneAndUpdate(
        { transactionId: pi.id },
        { status: 'canceled' },
        { new: true },
      );
      break;
    }
  }
  return { received: true };
};

const getPayments = async (query: Record<string, unknown>) => {
  const paymentQuery = new QueryBuilder(
    Payment.find({ isDeleted: false }).populate('student'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await paymentQuery.modelQuery;
  const meta = await paymentQuery.countTotal();
  return { result, meta };
};

const getPaymentById = async (id: string) => {
  const payment = await Payment.findById(id).populate('student');
  if (!payment || payment.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
  }
  return payment;
};

export const PaymentService = {
  createPaymentIntent,
  handleStripeWebhook,
  getPayments,
  getPaymentById,
};
