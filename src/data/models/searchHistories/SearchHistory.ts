import { Schema, model, Document } from 'mongoose';
import {  SearchHistoryType, Genre } from "../../interfaces/index.js";
type GenreType = (typeof Genre)[number];

type TSearchHistory = SearchHistoryType & Document

// Mongoose schema for SearchHistory
const SearchHistorySchema = new Schema<TSearchHistory>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  genres: {
    type: Map,
    of: Number,
    required: true,
    validate: {
      validator: function (v: Map<string, number>) {
        return Array.from(v.keys()).every((key) => Genre.includes(key as GenreType));
      },
      message: (props) => `${props.value} is not a valid genre!`,
    },
  },
}, { timestamps: true }
);

// Mongoose model for SearchHistory
const SearchHistory = model('SearchHistory', SearchHistorySchema);

export default SearchHistory;
