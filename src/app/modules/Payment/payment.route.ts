import { Router } from 'express';
import { PaymentController } from './payment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentValidation } from './payment.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

router.post(
  '/create-intent',
  auth(USER_ROLE.student),
  validateRequest(PaymentValidation.createIntentValidation),
  PaymentController.createIntent,
);

router.get('/get-all', auth(USER_ROLE.admin), PaymentController.getPayments);

router.get('/:id', auth(USER_ROLE.admin), PaymentController.getPaymentById);

export const PaymentRoutes = router;
