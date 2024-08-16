import { GraphQLError } from 'graphql'
import { User } from '../../../data/models/index.js';
import { ResponseHandler, generateOTP } from "../../../utils/helpers.js";
import { MyContext } from '../../../utils/auth.js'
import sendEmail from "../../../utils/sendEmail.js";

export default async (
  _: undefined,
  { email }: { email: string },
  { language }: MyContext
) => {
  const responseHandler = new ResponseHandler(language)

  try {
    const user = await User.findOne({ email })
    if (!user) return responseHandler.generateError('invalidEmailOrPassword')

    const OTP = generateOTP(6)
    const OTPExpiryTime = 3 * 60 * 1000
    user.OTP = OTP
    user.OTPExpireDate = new Date(Date.now() + OTPExpiryTime),

    await user.save()

    await sendEmail(email, OTP, OTPExpiryTime / (1000 * 60))
    return responseHandler.mutationSuccessResponse('successfulOperation', user)
  } catch (error) {
    return responseHandler.mutationFailResponse(error as GraphQLError);
  }
}