import { GraphQLError } from 'graphql'
import { User } from '../../../data/models/index.js';
import { ResponseHandler } from "../../../utils/helpers.js";
import { MyContext } from '../../../utils/auth.js'

export default async (
  _: undefined,
  { OTP, email }: { OTP: string; email: string },
  { language }: MyContext
) => {
  const responseHandler = new ResponseHandler(language)
  try {
    let user = await User.findOne({
      email,
      OTP,
      OTPExpireDate: { $gt: Date.now() }
    })

    if (!user) return responseHandler.generateError('invalidOTP')

    user.isVerified = true
    await user.save()

    return responseHandler.mutationSuccessResponse('successfulOperation', user)
  } catch (error) {
    return responseHandler.mutationFailResponse(error as GraphQLError);
  }
}