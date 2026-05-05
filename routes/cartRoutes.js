import express from "express";
import { isConsumer } from "../controllers/authMiddleware.js";
import * as cartController from "../controllers/cartController.js";

const router = express.Router();
router.use(isConsumer);

router.get("/", cartController.viewCart);
router.get("/count", cartController.getCartCount);

router.post("/add", cartController.addToCart);
router.post("/update", cartController.updateCart);
router.post("/purchase", cartController.purchase);

export default router;
