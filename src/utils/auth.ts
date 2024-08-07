import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request } from 'express';
dotenv.config();
import { User } from "../data/interfaces/index.js";
import { LanguageKeyType } from "../data/responseMessages/ResponseMessageType.js";
import { ResponseHandler } from "./helpers.js";

const { TOKEN_EXPIRATION } = process.env;
const TOKEN_SECRET = process.env.TOKEN_SECRET as Secret;


export interface AuthenticatedUserData {
  _id: string;
  username: string;
  email: string;
  role: User['role'];
}

export interface MyContext extends Request {
  user: AuthenticatedUserData;
  authorization?: string;
  language: LanguageKeyType;
  dataSources: any;
}

export type TRequest = {
  connectionParams: {
    Authorization: string
    language: LanguageKeyType
  }
  user?: AuthenticatedUserData
  language: LanguageKeyType
  authorization?: string
}

export default class AuthService {
  static generateJWT(user: AuthenticatedUserData): string {
    const options = { expiresIn: TOKEN_EXPIRATION };
    const payload: AuthenticatedUserData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    return jwt.sign({ data: payload }, TOKEN_SECRET, options);
  }

  static async verifyJWT(token: string): Promise<AuthenticatedUserData | undefined> {
    try {
      const { data } = jwt.verify(token, TOKEN_SECRET, {
        maxAge: TOKEN_EXPIRATION,
      }) as JwtPayload;
      return data;
    } catch (error) {
      console.error('Authentication error:', error);
      return undefined;
    }
  }

  static async authMiddleware(req: MyContext): Promise<MyContext | Request> {
    try {
      let language = req.headers.language as LanguageKeyType ?? 'en'
      req.language = language;

      let token = req.body.token || req.query.token || req.headers.authorization || '';

      // if no token, return request object as is
      if (!token) return req;

      token = token.split(' ').pop().trim();

      const decodedToken = await this.verifyJWT(token) as AuthenticatedUserData;

      req.user = decodedToken;
      req.authorization = token;

      return req;
    } catch (error) {
      console.error('Authentication error:', error);
      return req
    }
  }

  static async serverCleanup(req: TRequest) {
    let token = req.connectionParams.Authorization;
    let language = req.connectionParams.language ?? 'en';
    req.language = language;


    const responseHandler = new ResponseHandler(language)

    if (token) token = token.split(" ").pop()?.trim() || '';


    // if no token, return request object as is
    if (!token) return req;

    // if there is a token, try to decode and attach user data to the request object
    try {
      const decodedToken = await AuthService.verifyJWT(token) as AuthenticatedUserData;

      req.user = decodedToken;
      req.authorization = token;

      return req;
    } catch {
      return responseHandler.generateError("unauthorized");
    }
  }
}

// export async function authMiddleware(req: MyContext): Promise<MyContext | Request> {
//   try {
//     let language = req.headers.language as LanguageKeyType || 'en'
//     let token = req.body.token || req.query.token || req.headers.authorization || '';

//     // if no token, return request object as is
//     if (!token) return req;

//     token = token.split(' ').pop().trim();

//     const decodedToken = await verifyJWT(token) as AuthenticatedUserData;

//     req.user = decodedToken;
//     req.authorization = token;
//     req.language = language;

//     return req;
//   } catch (error) {
//     console.error('Authentication error:', error);
//     return req
//   }
// }

// export function generateJWT(user: AuthenticatedUserData) {

//   const options = { expiresIn: TOKEN_EXPIRATION };

//   const payload: AuthenticatedUserData = {
//     _id: user._id,
//     username: user.username,
//     email: user.email,
//     role: user.role,
//   };
//   return jwt.sign({ data: payload }, TOKEN_SECRET, options);
// }


// export function verifyJWT(token: string) {
// try {
//   const { data } = jwt.verify(token, TOKEN_SECRET, {
//     maxAge: TOKEN_EXPIRATION,
//   }) as JwtPayload;
//   return data;
// } catch (error) {
//   console.error('Authentication error:', error);
// }
// }
