
import { GraphQLError } from 'graphql'
import { User } from '../../../data/models/index.js';
import  AuthService  from '../../../utils/auth.js';
import { ResponseHandler } from '../../../utils/helpers.js'
import { MyContext } from '../../../utils/auth.js'

export default async (
  _: undefined,
  { email, password }: { email: string, password: string },
  { language }: MyContext
) => {
  const responseHandler = new ResponseHandler(language)

  try {
    const user = await User.findOne({ email })
    if (!user) return responseHandler.generateError('invalidEmailOrPassword')
    if (!user.isVerified) return responseHandler.generateError('EmailIsNotVerified')

    const comparePass = await user.comparePassword(password)
    if (!comparePass) return responseHandler.generateError('invalidEmailOrPassword')

    const userJWTData = {
      _id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role
    }

    const token = AuthService.generateJWT(userJWTData)
    user.token = token
    user.numberOfLogins += 1
    user.lastLogin = new Date()
    await user.save()

    return responseHandler.mutationSuccessResponse('successfulOperation', user)
  } catch (error) {
    return responseHandler.mutationFailResponse(error as GraphQLError);

  }
}