import express from "express";
import { isConsumer } from "../controllers/authMiddleware.js";
import * as consumerController from "../controllers/consumerController.js";

const router = express.Router();
router.use(isConsumer);

router.get("/dashboard", consumerController.dashboard);
router.get("/profile", consumerController.showProfile);

router.post("/profile", consumerController.updateProfile);

export default router;
