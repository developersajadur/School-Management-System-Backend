import { model, Schema } from 'mongoose';
import { IResult, ISubjectMark } from './result.interface';

const subjectMarkSchema = new Schema<ISubjectMark>({
  subject: { type: String, required: true },
  marks: { type: Number, required: true },
});

const resultSchema = new Schema<IResult>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    term: { type: String, required: true }, // e.g., "Midterm", "Final"
    year: { type: Number, required: true },
    subjects: { type: [subjectMarkSchema], required: true },
    totalMarks: { type: Number, required: true },
    grade: { type: String, required: true },
    remarks: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const Result = model<IResult>('Result', resultSchema);
