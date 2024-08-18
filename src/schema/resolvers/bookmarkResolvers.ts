// ========================= bookmark query controllers =========================
import readMyMovieBookmarks from "../../controllers/queries/bookmarks/readMyMovieBookmarks.js";
// ======================= bookmark mutation controllers ========================
import toggleBookmarkMovies from "../../controllers/mutations/bookmarks/toggleBookmarkMovies.js";
// ======================= bookmark Subscription controllers ========================


const bookmarkResolvers = {
  // ============================ movieCards queries ============================
  Query: {
    readMyMovieBookmarks
  },
  // =========================== movieCards mutations ===========================
  Mutation: {
    toggleBookmarkMovies
  }
};

export default bookmarkResolvers;
