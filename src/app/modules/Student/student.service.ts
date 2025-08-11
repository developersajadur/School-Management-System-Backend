import status from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { ICreateStudent } from './student.interface';
import { Student } from './student.model';
import { User } from '../User/user.model';

const createStudentIntoDb = async (data: ICreateStudent) => {
  const isExistUser = await User.findOne({
    $or: [{ email: data.email }, { phone: data.phone }],
  });
  if (isExistUser) {
    throw new AppError(
      status.CONFLICT,
      'User with this email or phone already exists',
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newUser = await User.create(
      [
        {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          phone: data.phone,
        },
      ],
      { session },
    );

    const existingStudent = await Student.findOne({
      rollNumber: data.rollNumber,
    });
    if (existingStudent) {
      throw new AppError(
        status.CONFLICT,
        'Student with this roll number already exists',
      );
    }

    if (data.assignedTeacher) {
      const isExistAssignedTeacher = await User.findById(data.assignedTeacher);
      if (!isExistAssignedTeacher || isExistAssignedTeacher.isDeleted) {
        throw new AppError(status.NOT_FOUND, 'Assigned teacher not found');
      } else if (isExistAssignedTeacher.role !== 'teacher') {
        throw new AppError(
          status.BAD_REQUEST,
          'Assigned user is not a teacher',
        );
      }
    }

    const studentData = {
      rollNumber: data.rollNumber,
      className: data.className,
      section: data.section,
      guardian: data.guardian,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      assignedTeacher: data.assignedTeacher || null,
      user: newUser[0]._id,
    };

    const student = await Student.create([studentData], { session });

    await session.commitTransaction();
    session.endSession();

    return student[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const StudentService = {
  createStudentIntoDb,
};
