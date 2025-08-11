import status from 'http-status';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { TeacherService } from './teacher.service';

const createTeacherIntoDb = catchAsync(async (req, res) => {
  const result = await TeacherService.createTeacherIntoDb(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Teacher created successfully',
    data: result,
  });
});

export const TeacherController = {
  createTeacherIntoDb,
};
