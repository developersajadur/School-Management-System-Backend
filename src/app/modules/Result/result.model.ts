/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema } from 'mongoose';
import { IResult, ISubjectMark } from './result.interface';

const subjectMarkSchema = new Schema<ISubjectMark>({
  subject: { type: String, required: true },
  marks: { type: Number, required: true, min: 0, max: 100 },
});

const resultSchema = new Schema<IResult>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    term: { type: String, required: true }, // e.g., "Midterm", "Final"
    year: { type: Number, required: true },
    subjects: { type: [subjectMarkSchema], required: true },
    totalMarks: { type: Number },
    grade: { type: String },
    remarks: { type: String },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

// 🔹 Grade calculation function
function calculateGrade(marks: number): string {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B';
  if (marks >= 60) return 'C';
  if (marks >= 50) return 'D';
  return 'F';
}

// 🔹 Auto-calculate totalMarks & grade before save
resultSchema.pre('save', function (next) {
  const total = this.subjects.reduce((sum, subj) => sum + subj.marks, 0);
  this.totalMarks = total;

  const average = total / this.subjects.length;
  this.grade = calculateGrade(average);

  next();
});

// 🔹 Auto-calculate for updates too
resultSchema.pre('findOneAndUpdate', function (next) {
  const update: any = this.getUpdate();

  if (update.subjects) {
    const total = update.subjects.reduce(
      (sum: number, subj: ISubjectMark) => sum + subj.marks,
      0,
    );
    update.totalMarks = total;

    const average = total / update.subjects.length;
    update.grade = calculateGrade(average);
  }

  next();
});

export const Result = model<IResult>('Result', resultSchema);
