import { Types } from 'mongoose';
import { TUserRole } from '../User/user.interface';

export interface IGuardian {
  name: string;
  phone: string;
  relation: string;
}

export interface IStudent {
  user: Types.ObjectId;
  rollNumber: string;
  className: string;
  section: string;
  guardian: IGuardian;
  dateOfBirth: Date;
  address: string;
  assignedTeacher?: Types.ObjectId;
  isDeleted: false;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateStudent {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  rollNumber: string;
  className: string;
  section: string;
  guardian: IGuardian;
  dateOfBirth: Date;
  address: string;
  assignedTeacher?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  phone: string;
}
