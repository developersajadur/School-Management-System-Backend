import status from 'http-status';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { StudentService } from './student.service';

const createStudentIntoDb = catchAsync(async (req, res) => {
  const result = await StudentService.createStudentIntoDb(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});

export const StudentController = {
  createStudentIntoDb,
};
