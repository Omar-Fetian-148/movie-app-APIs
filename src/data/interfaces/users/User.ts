import { Types } from 'mongoose';

export const USER_RULES = ['USER', 'ADMIN'] as const
export const GENDER = ['MALE', 'FEMALE'] as const

export default interface User {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  isVerified: boolean;
  phoneNumber: string;
  profilePictureUrl?: string;
  role: (typeof USER_RULES)[number];
  gender: (typeof GENDER)[number];
  token: string | null;
  createdAt: Date;
  updatedAt: Date;
  numberOfLogins: number;
  lastLogin?: Date;
  OTP?: String;
  OTPExpireDate?: Date;
  otpRequests: number;

  // methods
  save: () => Promise<User>;
  comparePassword: (password: String) => Promise<boolean>;
}

