import merge from 'lodash.merge';
// ======================= resolvers imports =======================
import movieCardResolvers from "./movieCardResolvers.js";
import userResolvers from "./userResolvers.js";
import otherResolvers from "./otherResolvers.js";
import bookmarkResolvers from "./bookmarkResolvers.js";


const resolvers = merge(
  {},
  movieCardResolvers,
  userResolvers,
  otherResolvers,
  bookmarkResolvers
);


export default resolvers;
