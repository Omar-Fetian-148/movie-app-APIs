import { GraphQLError } from 'graphql';
import { Readable } from 'stream';

import successMessages from '../data/responseMessages/successMessages.js';
import errorMessages from '../data/responseMessages/errorMessages.js';
import { LanguageKeyType, ResponseMessageKeyType } from "../data/responseMessages/ResponseMessageType.js";
import { Genre } from "../data/interfaces/index.js";

export type MutationFailResponseType = {
  code: number;
  success: boolean;
  message: string;
  helperMessage: string;
  data: null;
}

export type MutationSuccessResponseType<TData = any> = {
  code: number;
  success: boolean;
  message: string;
  data?: TData;
}

export type ErrorMessageResponseType = {
  code: number;
  success: boolean;
  error: string;
}

export class ResponseHandler {
  constructor(
    private language: LanguageKeyType = 'en'
  ) { }

  public mutationFailResponse(error: GraphQLError): MutationFailResponseType {
    return {
      code: !error.extensions ? 500 : (error.extensions.code as number),
      success: false,
      message: !error.extensions ? error.message : (error.extensions.error as string),
      helperMessage: error.message,
      data: null,
    };
  }

  public mutationSuccessResponse<TData>(
    key: ResponseMessageKeyType,
    data?: TData
  ): MutationSuccessResponseType<TData> {
    let messageObj = successMessages[key];

    if (messageObj === undefined) {
      messageObj = {
        code: 500,
        success: false,
        message: 'Key Not Found',
        ar: 'المفتاح غير موجود',
        en: 'Key Not Found',
      };
    }

    return {
      code: messageObj?.code as number,
      success: messageObj?.success as boolean,
      message: messageObj?.[this.language] as string,
      data,
    };
  }

  public generateError(key: ResponseMessageKeyType): void {
    let messageObj = errorMessages[key];
    if (messageObj === undefined) {
      messageObj = {
        code: 500,
        success: false,
        message: 'Key Not Found',
        ar: 'خطأ',
        en: 'Key Not Found',
      };
    }

    throw new GraphQLError(messageObj.en, {
      extensions: {
        code: messageObj.code,
        error: messageObj[this.language],
      },
    });
  }
}



export function generateOTP(limit: number) {
  let digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < limit; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP.toString()
}

type GenreType = (typeof Genre)[number]

export function getTopGenres(historicalGenres: { [key: string]: number } = {}, numberOfGenres: number): GenreType[] {
  const genresArray = Array.from(historicalGenres ? Object.entries(historicalGenres) : []) as [GenreType, number][];
  genresArray.sort((a, b) => b[1] - a[1]);
  const top5Genres = genresArray.slice(0, numberOfGenres);
  const genreTags = top5Genres.map(genre => genre[0]);
  return genreTags;
}

export async function calculateFileSize(stream: Readable) {
  let fileSize = 0;
  for await (const chunk of stream) {
    fileSize += chunk.length;
  }
  return fileSize;
};





// export function mutationFailResponse(error: GraphQLError): MutationFailResponseType {
//   return {
//     code: !error.extensions ? 500 : (error.extensions.code as number),
//     success: false,
//     message: !error.extensions ? error.message : (error.extensions.error as string),
//     helperMessage: error.message,
//     data: null,
//   };
// };


// export function mutationSuccessResponse<TData>(
//   key: ResponseMessageKeyType,
//   language: LanguageKeyType = 'en',
//   data?: TData
// ): MutationSuccessResponseType<TData> {

//   let messageObj = successMessages[key]

//   if (messageObj === undefined) {
//     messageObj = {
//       code: 500,
//       success: false,
//       message: 'Key Not Found',
//       ar: 'المفتاح غير موجود',
//       en: 'Key Not Found',
//     }
//   }

//   return {
//     code: messageObj?.code as number,
//     success: messageObj?.success as boolean,
//     message: messageObj?.[language] as string,
//     data,
//   };
// };



// export function generateError(
//   key: ResponseMessageKeyType,
//   language: LanguageKeyType = 'en',
// ): ErrorMessageResponseType {
//   let messageObj = errorMessages[key]
//   if (messageObj === undefined) {
//     messageObj = {
//       code: 500,
//       success: false,
//       message: 'Key Not Found',
//       ar: 'خطأ',
//       en: 'Key Not Found',
//     }
//   }

//   throw new GraphQLError(messageObj.en, {
//     extensions: {
//       code: messageObj?.code,
//       success: messageObj?.success as boolean,
//       error: messageObj?.[language],
//     },
//   });
// };

