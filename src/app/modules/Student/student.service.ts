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

const updateStudentIntoDb = async (
  id: string,
  data: Partial<ICreateStudent>,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const student = await Student.findById(id)
      .session(session)
      .populate('user');
    if (!student) {
      throw new AppError(status.NOT_FOUND, 'Student not found');
    }
    const user = await User.findById(student?.user).lean().select('isDeleted');
    if (!user || user?.isDeleted) {
      throw new AppError(status.NOT_FOUND, 'Associated User not found');
    }

    // Update related user if user fields provided
    if (data.name || data.email || data.password || data.phone || data.role) {
      await User.findByIdAndUpdate(
        student.user,
        {
          ...(data.name && { name: data.name }),
          ...(data.email && { email: data.email }),
          ...(data.phone && { phone: data.phone }),
        },
        { new: true, session },
      );
    }

    // Update student fields
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        ...(data.rollNumber && { rollNumber: data.rollNumber }),
        ...(data.className && { className: data.className }),
        ...(data.section && { section: data.section }),
        ...(data.guardian && { guardian: data.guardian }),
        ...(data.dateOfBirth && { dateOfBirth: data.dateOfBirth }),
        ...(data.address && { address: data.address }),
        ...(data.assignedTeacher !== undefined && {
          assignedTeacher: data.assignedTeacher,
        }),
      },
      { new: true, session },
    );

    await session.commitTransaction();
    session.endSession();

    return updatedStudent;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const StudentService = {
  createStudentIntoDb,
  updateStudentIntoDb,
};
