import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidationSchema } from '../Auth/auth.validation';
import { AuthControllers } from '../Auth/auth.controller';
import { loginLimiter } from '../../middlewares/rateLimiter';

const router = Router();

router.post(
  '/login',
  loginLimiter,
  validateRequest(AuthValidationSchema.loginUserValidation),
  AuthControllers.loginUser,
);

export const authRoute = router;
