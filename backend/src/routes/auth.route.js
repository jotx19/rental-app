import express from "express";
import { signup, verifyOtp, resendOtp, login, logout, checkAuth, emailVerification } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/email-verification", emailVerification);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/logout", logout);


router.get("/check", protectRoute, checkAuth);

export default router;
