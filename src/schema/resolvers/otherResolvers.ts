// ========================= Other query controllers =========================

// ======================= Other mutation controllers ========================
import checkOTP from "../../controllers/mutations/others/checkOTP.js";
import sendOTP from "../../controllers/mutations/others/sendOTP.js";


const otherResolvers = {
  // ============================ Other queries ============================
  // =========================== Other mutations ===========================
  Mutation: {
    checkOTP,
    sendOTP
  }
};

export default otherResolvers;
