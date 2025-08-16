import { Types } from 'mongoose';

export type TPaymentStatus = 'pending' | 'succeeded' | 'failed' | 'canceled';

export interface IPayment {
  _id: Types.ObjectId;
  student: Types.ObjectId; // ref: Student
  amount: number; // major unit (e.g., 100.00 USD)
  currency: string; // 'usd', 'bdt', etc.
  status: TPaymentStatus;
  transactionId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
