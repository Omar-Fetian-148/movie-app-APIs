import { GraphQLError } from 'graphql'
import { User } from '../../../data/models/index.js';
import { RegisterUserInput, User as UserType } from "../../../data/interfaces/index.js";
import { ResponseHandler, generateOTP } from '../../../utils/helpers.js'
import { MyContext } from '../../../utils/auth.js'

import validateUserRegister from "../../../utils/validations/validateUserRegister.js";
import sendEmail from "../../../utils/sendEmail.js";
import generateUrl from "../../../utils/generateUrl.js";

export default async (
  _: undefined,
  { username, email, role, gender, password, confirmPassword, profilePicture }: RegisterUserInput,
  { language }: MyContext
) => {
  const responseHandler = new ResponseHandler(language)

  try {
    const { error } = validateUserRegister.validate(
      {
        username, email, password, confirmPassword
      },
      { abortEarly: false }
    );
    if (error) throw new Error(error.details.map((x) => x.message).join(', '));

    const isExist = await User.findOne({ $or: [{ email }, { username }] })
    if (isExist) return responseHandler.generateError('userAlreadyExists')

    const matchedPass = password === confirmPassword ? true : false;
    if (!matchedPass) return responseHandler.generateError('passwordNotMatch')

    let profilePictureUrl: UserType['profilePictureUrl']

    if (profilePicture) {
      try {
        const { createReadStream } = await profilePicture.promise;
        const stream = createReadStream();
        profilePictureUrl = await generateUrl(stream, language, 'ProfilePictures');
      } catch (error) {
        console.error('Error uploading picture:', error);
        throw new Error('Failed to upload picture');
      }
    }
    const OTP = generateOTP(6)

    const OTPExpiryTime = 3 * 60 * 1000 //3 minutes
    const user = new User({
      username,
      email,
      password,
      gender,
      role,
      OTP,
      OTPExpireDate: Date.now() + OTPExpiryTime,
      ...(profilePicture && { profilePictureUrl })
    })

    await user.save()

    await sendEmail(email, OTP, OTPExpiryTime / (1000 * 60))
    return responseHandler.mutationSuccessResponse('successfulOperation', user)
  } catch (error) {
    console.error("Error in user registration:", error);
    return responseHandler.mutationFailResponse(error as GraphQLError);
  }
}