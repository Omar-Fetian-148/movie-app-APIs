// ========================= users query controllers =========================
import readMovieCards from "../../controllers/queries/movieCards/readMovieCards.js";
import readOneMovieCard from "../../controllers/queries/movieCards/readOneMovieCard.js";

// ======================= users mutation controllers ========================
import createMovieCard from "../../controllers/mutations/movieCards/createMovieCard.js";
// ======================= users Subscription controllers ========================


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
