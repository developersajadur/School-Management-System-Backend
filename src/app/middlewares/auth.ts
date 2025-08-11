/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../helpers/catchAsync';
import { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { TUserRole } from '../modules/User/user.interface';
import { tokenDecoder } from '../modules/Auth/auth.utils';
import { User } from '../modules/User/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decoded = tokenDecoder(req);
    const { role, userId } = decoded;
    const user: any = User.findById(userId);
    if (!user) {
      throw new AppError(status.UNAUTHORIZED, 'User not found!');
    }
    if (user.isBlocked) {
      throw new AppError(status.FORBIDDEN, 'User is blocked!');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
    }
    if (user.exp && Date.now() >= user.exp * 1000) {
      throw new AppError(status.UNAUTHORIZED, 'Token expired.');
    }

    (req as any).user = decoded as JwtPayload & { role: string };
    (req as any).user = user;
    next();
  });
};

export default auth;
