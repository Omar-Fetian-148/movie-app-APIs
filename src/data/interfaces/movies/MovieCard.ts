import { Readable } from 'stream';
import { Types } from 'mongoose';
export const Genre = [
  'ACTION',
  'ANIME',
  'ADVENTURE',
  'ANIMATION',
  'BIOGRAPHY',
  'COMEDY',
  'CRIME',
  'DOCUMENTARY',
  'DRAMA',
  'FANTASY',
  'HORROR',
  'MYSTERY',
  'ROMANCE',
  'SCI_FI',
  'THRILLER',
  'WESTERN',
  'FAMILY',
  'HISTORY',
  'MUSICAL',
  'WAR',
] as const;

export type MovieCardType = {
  _id: Types.ObjectId;
  name: string
  director: string
  storyline: string
  IMDbRating: number
  cast: string[]
  pictureUrl: string | void
  trailerUrl: string
  createdAt: Date
  updatedAt: Date
  genre: (typeof Genre)[number][];
  year: number

  // methods
  save: () => Promise<MovieCardType>;
}

type Attachment = {
  file: { createReadStream: () => Readable };
  promise: Promise<any>;
}

export type MovieCardInput = Omit<MovieCardType, 'createdAt' | 'updatedAt' | 'pictureUrl'> & {
  picture: Attachment
}


