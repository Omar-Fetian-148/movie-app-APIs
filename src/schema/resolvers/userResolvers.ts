// ========================= users query controllers =========================

// ======================= users mutation controllers ========================
import registerUser from "../../controllers/mutations/users/registerUser.js";
import loginUser from "../../controllers/mutations/users/loginUser.js";
// ======================= users Subscription controllers ========================


const userResolvers = {
  // ============================ movieCards queries ============================
  // =========================== movieCards mutations ===========================
  Mutation: {
    registerUser,
    loginUser
  }
};

export default userResolvers;
