import { USER_RULES, GENDER } from "./User.js";
import { Readable } from 'stream';
type RegisterUserInput = {
  username: string
  email: string
  role: (typeof USER_RULES)[number];
  gender: (typeof GENDER)[number];
  password: string
  confirmPassword: string
  profilePicture: {
    file: { createReadStream: () => Readable };
    promise: Promise<any>;
  }
}

export default RegisterUserInput