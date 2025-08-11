import { Router } from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidation } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

router.post(
  '/create',
  validateRequest(StudentValidation.createStudentValidation),
  auth(USER_ROLE.admin),
  StudentController.createStudentIntoDb,
);

export const StudentRoute = router;
