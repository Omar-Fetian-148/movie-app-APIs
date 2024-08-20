// ========================= Movies query controllers =========================
import readMovieCards from "../../controllers/queries/movieCards/readMovieCards.js";
import readOneMovieCard from "../../controllers/queries/movieCards/readOneMovieCard.js";
import readRecommendedMovies from "../../controllers/queries/movieCards/readRecommendedMovies.js";

// ======================= Movies mutation controllers ========================
import createMovieCard from "../../controllers/mutations/movieCards/createMovieCard.js";
// ======================= Movies Subscription controllers ========================


const movieCardResolvers = {
  // ============================ movieCards queries ============================
  Query: {
    readMovieCards,
    readOneMovieCard,
    readRecommendedMovies,
  },
  // =========================== movieCards mutations ===========================
  Mutation: {
    createMovieCard
  }
};

export default movieCardResolvers;
