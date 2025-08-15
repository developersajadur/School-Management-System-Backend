import { Router } from 'express';
import { authRoute } from '../modules/Auth/auth.route';
import { StudentRoute } from '../modules/Student/student.route';
import { teacherRoute } from '../modules/Teacher/teacher.route';
import { ResultRoutes } from '../modules/Result/result.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/students',
    route: StudentRoute,
  },
  {
    path: '/teachers',
    route: teacherRoute,
  },
  {
    path: '/results',
    route: ResultRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
