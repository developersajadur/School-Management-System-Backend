import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { TUser } from './user.interface';

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['admin', 'teacher', 'student'],
      required: true,
    },
    phone: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  const user = this as TUser;
  const password = user.password;
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.salt_rounds),
  );
  user.password = hashedPassword;
  next();
});

export const User = model<TUser>('User', userSchema);
