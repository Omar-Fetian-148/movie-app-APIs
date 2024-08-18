import { model, Schema, Document } from 'mongoose';
import { BookmarkType } from "../../interfaces/index.js";

type TBookmarkType = BookmarkType & Document

const bookmarkSchema = new Schema<TBookmarkType>({
  movieCardId: {
    type: Schema.Types.ObjectId,
    ref: 'MovieCard'
  },
  tvShowCardId: {
    type: Schema.Types.ObjectId,
    ref: 'TvShowCard'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
}, { timestamps: true }
)

export default model<TBookmarkType>('Bookmark', bookmarkSchema);
