/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { StudentService } from './student.service';
import { tokenDecoder } from '../Auth/auth.utils';

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

const getStudentsWithQuery = catchAsync(async (req, res) => {
  const students = await StudentService.getStudentsWithQuery(req?.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Students retrieved successfully',
    data: students,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  await StudentService.deleteStudent(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student deleted successfully',
    data: null,
  });
});

const getMyProfileForStudent = catchAsync(async (req, res) => {
  const decoded = tokenDecoder(req);
  const userId = decoded.userId;
  const result = await StudentService.getMyProfileForStudent(userId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student profile retrieved successfully',
    data: result,
  });
});

export const StudentController = {
  createStudentIntoDb,
  updateStudent,
  getStudentsWithQuery,
  deleteStudent,
  getMyProfileForStudent,
};
