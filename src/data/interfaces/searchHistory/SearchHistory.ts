import { Types } from 'mongoose';
import { Genre } from "../index.js";

type TGenre = (typeof Genre)[number]

type SearchHistoryType = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  genres: {
    [index in TGenre]: number
  };
  createdAt: Date;
  updatedAt: Date;

  // methods
  save: () => Promise<SearchHistoryType>;
}

export default SearchHistoryType

