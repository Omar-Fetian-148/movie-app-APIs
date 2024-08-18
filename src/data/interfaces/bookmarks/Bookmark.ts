import { Types } from 'mongoose';

type BookmarkType = {
  _id: Types.ObjectId;
  movieCardId?: Types.ObjectId;
  tvShowCardId?: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // methods
  save: () => Promise<BookmarkType>;
}

export default BookmarkType

