import httpStatus from 'http-status';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { messageServices } from './message.service';

const sendToStudent = catchAsync(async (req, res) => {
  const { studentId, message } = req.body;

  const result = await messageServices.sendToStudent(studentId, message);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.fallback
      ? 'SMS logged to console (Twilio disabled)'
      : 'SMS sent successfully',
    data: result,
  });
});

const sendToMultipleStudents = catchAsync(async (req, res) => {
  const { studentIds, message } = req.body;

  const results = await messageServices.sendToMultipleStudents(
    studentIds,
    message,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bulk SMS processed',
    data: results,
  });
});

const sendToGuardians = catchAsync(async (req, res) => {
  const { studentIds, message } = req.body;

  const results = await messageServices.sendToGuardians(studentIds, message);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Guardian SMS processed',
    data: results,
  });
});

const sendToClass = catchAsync(async (req, res) => {
  const { className, section, message } = req.body;

  const results = await messageServices.sendToClass(
    className,
    section,
    message,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Bulk SMS sent to class ${className}${section ? '-' + section : ''}`,
    data: results,
  });
});

export const messageController = {
  sendToStudent,
  sendToMultipleStudents,
  sendToGuardians,
  sendToClass,
};
