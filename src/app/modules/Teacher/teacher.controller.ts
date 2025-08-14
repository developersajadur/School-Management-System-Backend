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

const updateTeacherIntoDb = catchAsync(async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const result = await TeacherService.updateTeacherIntoDb(id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Teacher updated successfully',
    data: result,
  });
});

export const TeacherController = {
  createTeacherIntoDb,
  updateTeacherIntoDb,
};
