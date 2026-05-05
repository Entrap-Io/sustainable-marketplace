import express from "express";
import { isMarket } from "../controllers/authMiddleware.js";
import { upload } from "../controllers/marketController.js";
import * as marketController from "../controllers/marketController.js";

const router = express.Router();
router.use(isMarket);

router.get("/dashboard", marketController.dashboard);
router.get("/profile", marketController.showProfile);

router.post("/profile", marketController.updateProfile);

router.get("/product/add", marketController.showAddProduct);

router.post("/product/add", upload.single("image"), marketController.addProduct);

router.get("/product/edit/:id", marketController.showEditProduct);

router.post("/product/edit/:id", upload.single("image"), marketController.editProduct);

router.post("/product/delete/:id", marketController.deleteProduct);

export default router;
