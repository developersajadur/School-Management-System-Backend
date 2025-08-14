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

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const result = await StudentService.updateStudentIntoDb(id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student updated successfully',
    data: result,
  });
});

export const StudentController = {
  createStudentIntoDb,
  updateStudent,
};
