// ========================= Movies query controllers =========================
import readMovieCards from "../../controllers/queries/movieCards/readMovieCards.js";
import readOneMovieCard from "../../controllers/queries/movieCards/readOneMovieCard.js";

// ======================= Movies mutation controllers ========================
import createMovieCard from "../../controllers/mutations/movieCards/createMovieCard.js";
// ======================= Movies Subscription controllers ========================


const movieCardResolvers = {
  // ============================ movieCards queries ============================
  Query: {
    readMovieCards,
    readOneMovieCard,
  },
  // =========================== movieCards mutations ===========================
  Mutation: {
    createMovieCard
  }
};

export default movieCardResolvers;
