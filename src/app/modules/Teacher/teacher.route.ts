import { Router } from 'express';
import { TeacherController } from './teacher.controller';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { TeacherValidation } from './teacher.validation';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/create',
  validateRequest(TeacherValidation.createTeacherValidation),
  auth(USER_ROLE.admin),
  TeacherController.createTeacherIntoDb,
);

export const teacherRoute = router;
