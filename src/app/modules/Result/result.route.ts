import express from 'express';
import { ResultController } from './result.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { resultValidation } from './result.validation';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  validateRequest(resultValidation.createResultValidation),
  ResultController.createResult,
);

router.patch(
  '/update/:resultId',
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  validateRequest(resultValidation.updateResultValidation),
  ResultController.updateResult,
);

router.get(
  '/get-all',
  auth(USER_ROLE.admin, USER_ROLE.teacher),
  ResultController.getAllResults,
);

router.get(
  '/my-results',
  auth(USER_ROLE.student),
  ResultController.getStudentResults,
);

export const ResultRoutes = router;
