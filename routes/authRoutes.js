import express from "express";
import { body } from "express-validator";
import { showLogin, processLogin, showRegister, processRegister, showVerify, processVerify, logout } from "../controllers/authController.js";

const router = express.Router();

router.get("/login", showLogin);

router.post("/login", processLogin);

router.get("/register", showRegister);

router.post("/register", [
  body("email").isEmail().withMessage("Must be a valid email"),
  body("password").isLength({ min: 4 }).withMessage("Password must be at least 4 chars"),
  body("role").isIn(['market', 'consumer']).withMessage("Invalid role"),
  body("name").notEmpty().withMessage("Name is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("district").notEmpty().withMessage("District is required"),
], processRegister);

router.get("/verify", showVerify);

router.post("/verify", processVerify);

router.get("/logout", logout);

export default router;
