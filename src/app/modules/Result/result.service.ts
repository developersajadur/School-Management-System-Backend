import { Result } from './result.model';
import { IResult } from './result.interface';
import QueryBuilder from '../../builders/QueryBuilder';
import { Student } from '../Student/student.model';
import AppError from '../../errors/AppError';
import status from 'http-status';

const createResult = async (payload: IResult) => {
  const student = await Student.findById(payload.student);
  if (!student || student.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Student Not Found');
  }
  const result = await Result.create(payload);
  return result;
};

const updateResult = async (resultId: string, payload: Partial<IResult>) => {
  const isResultExist = await Result.findById(resultId)
    .select('student')
    .select('isDeleted');
  if (!isResultExist || isResultExist.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Result Not Found');
  }
  const student = await Student.findById(isResultExist?.student);
  if (!student || student.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'Student Not Found');
  }
  const result = await Result.findOneAndUpdate(
    { _id: resultId, isDeleted: false },
    payload,
    { new: true, runValidators: true },
  );

  return result;
};

const getAllResults = async (query: Record<string, unknown>) => {
  const resultQuery = new QueryBuilder(
    Result.find({ isDeleted: false }).populate('student'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await resultQuery.modelQuery;
  const meta = await resultQuery.countTotal();

  return { result, meta };
};

const getStudentResults = async (studentId: string) => {
  const student = await Student.findOne({ user: studentId }).select('_id');
  const results = await Result.find({
    student: student?._id,
    isDeleted: false,
  }).populate('student');

  return results;
};

export const ResultService = {
  createResult,
  updateResult,
  getAllResults,
  getStudentResults,
};
