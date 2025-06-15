import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    // Generate JWT for the user
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    // Send token as cookie or redirect with token
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    // Redirect to frontend or send user info
    res.redirect("http://localhost:5173/"); // or send user info as JSON
  }
);

export default router;
