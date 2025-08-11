import { Router } from 'express';
import { userController } from './user.controller';

const router = Router();

router.post(
  '/register',
  //   validateRequest(UserValidationSchema.createUserValidation),
  userController.createUserIntoDb,
);
// router.get('/', auth(USER_ROLE.admin), userController.getAllUsers);

export const userRoute = router;
