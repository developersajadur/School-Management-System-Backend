import { model, Schema } from 'mongoose';
import { IGuardian, IStudent } from './student.interface';

const guardianSchema = new Schema<IGuardian>({
  name: { type: String, required: [true, 'Guardian name is required'] },
  phone: {
    type: String,
    required: [true, 'Guardian phone number is required'],
  },
  relation: {
    type: String,
    required: [true, 'Relation to student is required'],
  },
});

const studentSchema = new Schema<IStudent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
    },
    className: { type: String, required: [true, 'Class name is required'] },
    section: { type: String, required: [true, 'Section is required'] },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required'],
    },
    dateOfBirth: { type: Date, required: [true, 'Date of birth is required'] },
    address: { type: String, required: [true, 'Address is required'] },
    assignedTeacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export const Student = model<IStudent>('Student', studentSchema);
