import status from 'http-status';
import { ICreateTeacher } from './teacher.interface';
import { Teacher } from './teacher.model';
import AppError from '../../errors/AppError';
import mongoose from 'mongoose';
import { USER_ROLE } from '../User/user.constant';
import { User } from '../User/user.model';

const createTeacherIntoDb = async (data: ICreateTeacher) => {
  const isExistTeacher = await Teacher.findOne({
    $or: [{ email: data.email }, { phone: data.phone }],
  });
  if (isExistTeacher) {
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

    const existingTeacher = await Teacher.findOne({
      email: data.email,
      role: USER_ROLE.teacher,
    });
    if (existingTeacher) {
      throw new AppError(
        status.CONFLICT,
        'Teacher with this email already exists',
      );
    }

    const teacherData = {
      subjects: data.subjects,
      classes: data.classes,
      address: data.address,
      joiningDate: data.joiningDate,
      user: newUser[0]._id,
    };

    const student = await Teacher.create([teacherData], { session });

    await session.commitTransaction();
    session.endSession();

    return student[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateTeacherIntoDb = async (
  id: string,
  data: Partial<ICreateTeacher>,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const teacher = await Teacher.findById(id).session(session);
    if (!teacher) {
      throw new AppError(status.NOT_FOUND, 'Teacher not found');
    }

    const user = await User.findById(teacher.user).session(session);
    if (!user) {
      throw new AppError(status.NOT_FOUND, 'Associated user not found');
    }

    // Update user fields conditionally
    await User.findByIdAndUpdate(
      teacher.user,
      {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.phone && { phone: data.phone }),
      },
      { new: true, session },
    );

    // Update teacher fields conditionally
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      {
        ...(data.subjects && { subjects: data.subjects }),
        ...(data.classes && { classes: data.classes }),
        ...(data.address && { address: data.address }),
        ...(data.joiningDate && { joiningDate: data.joiningDate }),
      },
      { new: true, session },
    );

    await session.commitTransaction();
    session.endSession();

    return updatedTeacher;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const TeacherService = {
  createTeacherIntoDb,
  updateTeacherIntoDb,
};
