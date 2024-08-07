/*
Error status codes
400 [Bad Request]
401 [Unauthorized]
402 [Payment Required]
403 [Forbidden]
404 [Not Found]
405 [Method Not Allowed]
406 [Not Acceptable]
408 [Request Timeout]
429 [Too Many Requests]
451 [Unavailable For Legal Reasons]
*/

import { ResponseMessageType } from "./ResponseMessageType.js";

const errorMessages: ResponseMessageType = {
  unauthorized: {
    code: 401,
    success: false,
    message: 'unauthorized',
    ar: 'غير مصرح',
    en: 'unauthorized',
  },
  PictureTooLarge: {
    code: 400,
    success: false,
    message: 'Picture Too Large',
    ar: 'غير مصرح',
    en: 'Picture Too Large',
  },
  TrailerTooLarge: {
    code: 400,
    success: false,
    message: 'Trailer Too Large',
    ar: 'غير مصرح',
    en: 'Trailer Too Large',
  },
  uploadError: {
    code: 400,
    success: false,
    message: 'upload Error',
    ar: 'غير مصرح',
    en: 'upload Error',
  },
}

export default errorMessages