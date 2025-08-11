/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../../errors/AppError';

import bcrypt from 'bcrypt';
import config from '../../config';
import { TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';
import { User } from '../User/user.model';

export type TJwtPayload = {
  userId: string;
  email: string;
  role: string;
};

const loginUser = async (payload: TLoginUser): Promise<{ token: string }> => {
  const user = await User.findOne({ email: payload?.email }).select(
    '+password',
  );
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User Not Found');
  }
  const passwordMatch = await bcrypt.compare(payload?.password, user?.password);

  if (!passwordMatch) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid password!');
  }

  const jwtPayload = {
    userId: user?._id.toString(),
    email: user?.email,
    role: user?.role,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_token_secret as string,
    config.jwt_token_expires_in as any,
  );

  return { token };
};

export const AuthServices = {
  loginUser,
};
