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

router.patch(
  '/update/:id',
  validateRequest(StudentValidation.updateStudentValidation),
  auth(USER_ROLE.admin),
  StudentController.updateStudent,
);

router.get(
  '/get-all',
  auth(USER_ROLE.admin),
  StudentController.getStudentsWithQuery,
);

export const StudentRoute = router;
