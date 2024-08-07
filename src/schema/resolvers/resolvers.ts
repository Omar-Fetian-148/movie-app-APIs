import merge from 'lodash.merge';
// ======================= resolvers imports =======================
import movieCardResolvers from "./movieCardResolvers.js";


const resolvers = merge(
  {},
  movieCardResolvers
);

export default resolvers;
