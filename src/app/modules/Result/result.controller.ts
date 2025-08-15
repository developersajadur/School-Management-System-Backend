import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ResultService } from './result.service';
import { tokenDecoder } from '../Auth/auth.utils';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';

const createResult = catchAsync(async (req: Request, res: Response) => {
  const decoded = tokenDecoder(req);
  const id = decoded.userId;
  const result = await ResultService.createResult({
    ...req.body,
    createdBy: id,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Result created successfully',
    data: result,
  });
});

const updateResult = catchAsync(async (req: Request, res: Response) => {
  const decoded = tokenDecoder(req);
  const updaterId = decoded.userId;
  const { id } = req.params;
  const result = await ResultService.updateResult(id, {
    ...req.body,
    updatedBy: updaterId,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Result updated successfully',
    data: result,
  });
});

const getAllResults = catchAsync(async (req: Request, res: Response) => {
  const results = await ResultService.getAllResults(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Results retrieved successfully',
    data: results,
  });
});

const getStudentResults = catchAsync(async (req: Request, res: Response) => {
  const decoded = tokenDecoder(req);
  const studentId = decoded.userId;
  const results = await ResultService.getStudentResults(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student results retrieved successfully',
    data: results,
  });
});

export const ResultController = {
  createResult,
  updateResult,
  getAllResults,
  getStudentResults,
};
