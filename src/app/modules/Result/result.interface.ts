import { Document, Types } from 'mongoose';

export interface ISubjectMark {
  subject: string;
  marks: number;
}

export interface IResult extends Document {
  student: Types.ObjectId;
  term: string;
  year: number;
  subjects: ISubjectMark[];
  totalMarks: number;
  grade: string;
  remarks?: string;
  isDeleted: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
