import merge from 'lodash.merge';
// ======================= resolvers imports =======================
import movieCardResolvers from "./movieCardResolvers.js";
import userResolvers from "./userResolvers.js";


const resolvers = merge(
  {},
  movieCardResolvers,
  userResolvers
);

export default resolvers;
