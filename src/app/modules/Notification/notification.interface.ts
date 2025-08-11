import { Document, Types } from 'mongoose';

export interface INotification extends Document {
  recipient: Types.ObjectId;
  message: string;
  type: 'sms' | 'system';
  sentBy: Types.ObjectId;
  isDeleted: boolean;
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
