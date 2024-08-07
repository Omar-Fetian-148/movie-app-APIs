type ResponseMessageType = {
  [key: string]: {
    code: number;
    success: boolean;
    message: string;
    ar: string;
    en: string;
  };
};


type ResponseMessageKeyType = keyof ResponseMessageType
type LanguageKeyType = 'ar' | 'en'

export { ResponseMessageType, ResponseMessageKeyType, LanguageKeyType };