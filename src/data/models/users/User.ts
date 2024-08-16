import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'username is required'],
    trim: true,
    minlength: 2,
    maxlength: 32
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    trim: true,
    minlength: 5,
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    trim: true,
    minlength: 5,
    maxlength: 32,
    unique: true,
    set: (v: string) => v.toLowerCase(),
  },
  numberOfLogins: {
    type: Number,
    default: 0,
  },
  lastLogin: {
    type: Date,
  },
  token: {
    type: String,
  },
  profilePictureUrl: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  },
  bio: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE'],
    required: [true, 'gender is required'],
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  OTP: {
    type: String,
  },
  OTPExpireDate: {
    type: Date
  },
  otpRequests: {
    type: Number,
    default: 0,
  },
  bookmarksCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    this.password = await bcrypt.hash(
      (this.password + process.env.PEPPER),
      parseInt(process.env.SALT_ROUNDS as string)
    );
  }
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(
    (password + process.env.PEPPER),
    this.password
  );
};

export default model('User', userSchema);
