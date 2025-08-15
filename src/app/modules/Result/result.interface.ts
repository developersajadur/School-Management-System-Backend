import { Types } from 'mongoose';

export interface ISubjectMark {
  subject: string;
  marks: number;
}

export interface IResult {
  student: Types.ObjectId;
  term: string;
  year: number;
  subjects: ISubjectMark[];
  totalMarks: number;
  grade: string;
  remarks?: string;
  isDeleted: boolean;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
