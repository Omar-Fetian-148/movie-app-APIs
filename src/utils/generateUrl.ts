import { UploadApiResponse, UploadApiOptions } from 'cloudinary';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';
import { LanguageKeyType } from "../data/responseMessages/ResponseMessageType.js";

import { ResponseHandler,  } from './helpers.js';

type FolderName = 'MoviePictures' | 'ProfilePictures'

// const MAX_FILE_SIZE = 5 * 1024 * 1024;
export default async (
  stream: Readable,
  language: LanguageKeyType,
  folderName: FolderName
) => {
  const responseHandler = new ResponseHandler(language)

  try {

    // Check file size before uploading
    // let fileSize = await calculateFileSize(stream)

    // if (fileSize > MAX_FILE_SIZE) {
    //   if (folderName === 'MoviePictures') {
    //     throw new Error("PictureTooLarge");
    //   } else {
    //     throw new Error("TrailerTooLarge");
    //   }
    // }

    const options: UploadApiOptions = {
      use_filename: true,
      unique_filename: true,
      resource_type: 'auto',
      folder: folderName,
      overwrite: true,
      quality: 'auto',
    };

    const uploadedFile: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          options,
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error('Upload result is undefined'));
            }
          }
        );

        stream.pipe(uploadStream);
      }
    );
    if (uploadedFile) {
      return uploadedFile.secure_url as string;
    } else {
      return responseHandler.generateError('uploadError');
    }
  } catch (error: any) {
    return responseHandler.generateError(error.message);
  }
}
