import merge from 'lodash.merge';
// ======================= resolvers imports =======================
import movieCardResolvers from "./movieCardResolvers.js";
import userResolvers from "./userResolvers.js";
import otherResolvers from "./otherResolvers.js";


const resolvers = merge(
  {},
  movieCardResolvers,
  userResolvers,
  otherResolvers
);

export default resolvers;
