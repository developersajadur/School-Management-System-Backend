/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { TeacherService } from './teacher.service';
import { tokenDecoder } from '../Auth/auth.utils';

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
  const result = await TeacherService.updateTeacherIntoDb(id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Teacher updated successfully',
    data: result,
  });
});

const getTeachersWithQuery = catchAsync(async (req, res) => {
  const teachers = await TeacherService.getTeachersWithQuery(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Teachers retrieved successfully',
    data: teachers,
  });
});

const deleteTeacher = catchAsync(async (req, res) => {
  await TeacherService.deleteTeacher(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Teacher deleted successfully',
    data: null,
  });
});

const getAssignedStudents = catchAsync(async (req, res) => {
  const decoded = tokenDecoder(req);
  const userId = decoded.userId;
  const students = await TeacherService.getAssignedStudents(userId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Assigned students retrieved successfully',
    data: students,
  });
});

const getMyProfileForTeacher = catchAsync(async (req, res) => {
  const decoded = tokenDecoder(req);
  const userId = decoded.userId;

  const result = await TeacherService.getMyProfileForTeacher(userId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Student profile retrieved successfully',
    data: result,
  });
});

export const TeacherController = {
  createTeacherIntoDb,
  updateTeacherIntoDb,
  getTeachersWithQuery,
  deleteTeacher,
  getAssignedStudents,
  getMyProfileForTeacher,
};
