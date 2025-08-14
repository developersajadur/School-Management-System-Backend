/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { ICreateStudent } from './student.interface';
import { Student } from './student.model';
import { User } from '../User/user.model';
import QueryBuilder from '../../builders/QueryBuilder';
import { studentSearchableFields } from './student.constant';
import { Teacher } from '../Teacher/teacher.model';

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
    if (!student || student.isDeleted) {
      throw new AppError(status.NOT_FOUND, 'Student not found');
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

    if (data.assignedTeacher) {
      const isExistAssignedTeacher = await Teacher.findById(
        data.assignedTeacher,
      );
      if (!isExistAssignedTeacher || isExistAssignedTeacher.isDeleted) {
        throw new AppError(status.NOT_FOUND, 'Assigned teacher not found');
      }
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

const getStudentsWithQuery = async (query: Record<string, unknown>) => {
  const search = query.search ? String(query.search) : null;

  if (search) {
    // Aggregation-based search
    const pipeline: any[] = [
      { match: { isDeleted: false } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $match: {
          $or: studentSearchableFields.map((field) => ({
            [field]: { $regex: search, $options: 'i' },
          })),
        },
      },
    ];

    // Run aggregation
    const result = await Student.aggregate(pipeline);

    return {
      result,
      meta: {
        page: 1,
        limit: result.length,
        total: result.length,
        totalPage: 1,
      },
    };
  } else {
    // Use QueryBuilder for normal queries (no deep search)
    const studentQuery = new QueryBuilder(
      Student.find({ isDeleted: false })
        .populate('user')
        .populate('assignedTeacher'),
      query,
    )
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await studentQuery.modelQuery;
    const meta = await studentQuery.countTotal();
    return { result, meta };
  }
};

const deleteStudent = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const student = await Student.findById(id).session(session);
    if (!student || student.isDeleted) {
      throw new AppError(status.NOT_FOUND, 'Student not found');
    }

    // Soft delete student
    await Student.findByIdAndUpdate(id, { isDeleted: true }, { session });

    // Soft delete linked user
    if (student.user) {
      await User.findByIdAndUpdate(
        student.user,
        { isDeleted: true },
        { session },
      );
    }

    await session.commitTransaction();
    session.endSession();

    return student;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getMyProfileForStudent = async (userId: string) => {
  const result = await Student.findOne({
    user: userId,
    isDeleted: false,
  })
    .populate('user')
    .populate('assignedTeacher');

  return result;
};
export const StudentService = {
  createStudentIntoDb,
  updateStudentIntoDb,
  getStudentsWithQuery,
  deleteStudent,
  getMyProfileForStudent,
};
