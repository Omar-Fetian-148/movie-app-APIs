// ========================= users query controllers =========================
import registerUser from "../../controllers/mutations/users/registerUser.js";
// ======================= users mutation controllers ========================
// ======================= users Subscription controllers ========================


const movieCardResolvers = {
  // ============================ movieCards queries ============================
  // =========================== movieCards mutations ===========================
  Mutation: {
    registerUser
  }
};

export default movieCardResolvers;
