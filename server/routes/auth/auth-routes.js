import express from "express";
import { registerUser,forgetPassword, verifyResetCode, updatePassword,loginUser, logoutUser, authMiddleware } from "../../controllers/auth/auth-controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/forgot-password", forgetPassword);
router.post("/otp-verification", verifyResetCode);
router.post('/update-password' ,updatePassword);

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

export default router;
