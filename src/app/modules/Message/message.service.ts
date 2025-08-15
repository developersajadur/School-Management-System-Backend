/* eslint-disable @typescript-eslint/no-explicit-any */
import twilio from 'twilio';
import { Student } from '../Student/student.model';
import AppError from '../../errors/AppError';
import status from 'http-status';

const {
  TWILIO_ACCOUNT_SID = '',
  TWILIO_AUTH_TOKEN = '',
  TWILIO_PHONE_NUMBER = '',
} = process.env;

const USE_TWILIO =
  TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER;

// Create Twilio client only if credentials exist
const twilioClient = USE_TWILIO
  ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null;

async function sendToNumber(phone: string, message: string) {
  if (!USE_TWILIO) {
    console.log(`📢 [FAKE SMS] To: ${phone} | Message: ${message}`);
    return { success: true, fallback: true };
  }

  const sms = await twilioClient!.messages.create({
    body: message,
    from: TWILIO_PHONE_NUMBER,
    to: phone,
  });

  return { success: true, sid: sms.sid, fallback: false };
}

const sendToStudent = async (studentId: string, message: string) => {
  const student = await Student.findById(studentId).populate('user');
  if (!student) throw new AppError(status.NOT_FOUND, 'Student not found');

  const phone = (student as any).user?.phone;
  if (!phone) throw new AppError(status.NOT_FOUND, 'Phone Number not found');

  return await sendToNumber(phone, message);
};

const sendToMultipleStudents = async (
  studentIds: string[],
  message: string,
) => {
  const students = await Student.find({
    _id: { $in: studentIds },
    isDeleted: false,
  }).populate('user');
  const results = [];

  for (const student of students) {
    const phone = (student as any).user?.phone;
    if (phone) results.push(await sendToNumber(phone, message));
  }

  return results;
};

const sendToGuardians = async (studentIds: string[], message: string) => {
  const students = await Student.find({
    _id: { $in: studentIds },
    isDeleted: false,
  });
  const results = [];

  for (const student of students) {
    const phone = student.guardian?.phone;
    if (phone) results.push(await sendToNumber(phone, message));
  }

  return results;
};

const sendToClass = async (
  className: string,
  section: string,
  message: string,
) => {
  const filter: {
    section?: string;
    className: string;
  } = { className };
  if (section) filter.section = section;

  const students = await Student.find(filter).populate('user');
  return Promise.all(
    students.map((s) => sendToNumber((s as any).user?.phone, message)),
  );
};

export const messageServices = {
  sendToStudent,
  sendToMultipleStudents,
  sendToGuardians,
  sendToClass,
};
