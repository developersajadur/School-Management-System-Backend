import { Types } from 'mongoose';
import { TUserRole } from '../User/user.interface';

export interface ITeacher {
  user: Types.ObjectId;
  subjects: string[];
  classes: string[];
  address: string;
  joiningDate: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTeacher {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  subjects: string[];
  classes: string[];
  address: string;
  joiningDate: Date;
  role: TUserRole;
  name: string;
  email: string;
  password: string;
  phone: string;
}
