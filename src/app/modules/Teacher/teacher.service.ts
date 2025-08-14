/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import { ICreateTeacher } from './teacher.interface';
import { Teacher } from './teacher.model';
import AppError from '../../errors/AppError';
import mongoose from 'mongoose';
import { USER_ROLE } from '../User/user.constant';
import { User } from '../User/user.model';
import QueryBuilder from '../../builders/QueryBuilder';
import { teacherSearchableFields } from './teacher.constant';

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
    if (!teacher || teacher.isDeleted) {
      throw new AppError(status.NOT_FOUND, 'Teacher not found');
    }

    const user = await User.findById(teacher.user).session(session);
    if (!user || user.isDeleted) {
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

const getTeachersWithQuery = async (query: Record<string, unknown>) => {
  const search = query.search ? String(query.search) : null;

  if (search) {
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
          $or: teacherSearchableFields.map((field) => ({
            [field]: { $regex: search, $options: 'i' },
          })),
        },
      },
    ];

    // Sorting
    if (query.sort) {
      const sortFields = (query.sort as string).split(',').join(' ');
      pipeline.push({
        $sort: Object.fromEntries(
          sortFields
            .split(' ')
            .map((f) => [f.replace('-', ''), f.startsWith('-') ? -1 : 1]),
        ),
      });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Pagination
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip }, { $limit: limit });

    const result = await Teacher.aggregate(pipeline);
    const total = await Teacher.countDocuments({ isDeleted: false });

    return {
      result,
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  } else {
    // Use QueryBuilder for normal queries
    const teacherQuery = new QueryBuilder(
      Teacher.find({ isDeleted: false }).populate('user'),
      query,
    )
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await teacherQuery.modelQuery;
    const meta = await teacherQuery.countTotal();
    return { result, meta };
  }
};

const deleteTeacher = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const teacher = await Teacher.findById(id).session(session);
    if (!teacher || teacher.isDeleted) {
      throw new AppError(status.NOT_FOUND, 'Teacher not found');
    }

    // Soft delete teacher
    await Teacher.findByIdAndUpdate(id, { isDeleted: true }, { session });

    // Soft delete linked user
    if (teacher.user) {
      await User.findByIdAndUpdate(
        teacher.user,
        { isDeleted: true },
        { session },
      );
    }

    await session.commitTransaction();
    session.endSession();

    return teacher;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const TeacherService = {
  createTeacherIntoDb,
  updateTeacherIntoDb,
  getTeachersWithQuery,
  deleteTeacher,
};
