/*
Success status codes
200 [OK]
201 [Created]
202 [Accepted]
203 [Non-Authoritative Information]
204 [No Content]
205 [Reset Content]
*/
import { ResponseMessageType } from "./ResponseMessageType.js";

const successMessages: ResponseMessageType = {
  successfulOperation: {
    code: 200,
    success: true,
    message: 'Successful Operation',
    ar: 'عملية ناجحة',
    en: 'Successful Operation',
  },
}
export default successMessages
