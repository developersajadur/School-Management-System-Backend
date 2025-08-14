import { model, Schema } from 'mongoose';
import { ITeacher } from './teacher.interface';

const teacherSchema = new Schema<ITeacher>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference (ID) is required for a teacher'],
    },
    subjects: {
      type: [String],
      required: [true, 'At least one subject must be assigned to the teacher'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'Subjects array cannot be empty',
      },
    },
    classes: {
      type: [String],
      required: [true, 'At least one class must be assigned to the teacher'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'Classes array cannot be empty',
      },
    },
    address: {
      type: String,
      required: [true, "Teacher's address is required"],
    },
    joiningDate: { type: Date, required: [true, 'Joining date is required'] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Teacher = model<ITeacher>('Teacher', teacherSchema);
