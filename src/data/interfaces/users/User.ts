import { Types } from 'mongoose';

export const USER_RULES = ['USER', 'ADMIN'] as const
export const GENDER = ['MALE', 'FEMALE'] as const

type User = {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  isVerified: boolean;
  phoneNumber: string;
  role: (typeof USER_RULES)[number];
  gender: (typeof GENDER)[number];
  token: string | null;
  createdAt: Date;
  updatedAt: Date;
  bookmarksCount: number;
  numberOfLogins: number;
  profilePictureUrl?: string | void;
  bio?: string;
  lastLogin?: Date;
  OTP?: String;
  OTPExpireDate?: Date;
  otpRequests: number;
  isAdmin: Boolean;

  // methods
  save: () => Promise<User>;
  comparePassword: (password: String) => Promise<boolean>;
}

export default User