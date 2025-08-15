import { Router } from 'express';
import { messageController } from './message.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { messageValidation } from './message.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.post(
  '/send-to-student',
  validateRequest(messageValidation.sendToStudentSchema),
  auth(USER_ROLE.admin),
  messageController.sendToStudent,
);
router.post(
  '/send-to-multiple',
  validateRequest(messageValidation.sendToMultipleStudentsSchema),
  auth(USER_ROLE.admin),
  messageController.sendToMultipleStudents,
);
router.post(
  '/send-to-guardians',
  validateRequest(messageValidation.sendToGuardiansSchema),
  auth(USER_ROLE.admin),
  messageController.sendToGuardians,
);
router.post(
  '/send-to-class',
  validateRequest(messageValidation.sendToClassSchema),
  auth(USER_ROLE.admin),
  messageController.sendToClass,
);

export const messageRoutes = router;
