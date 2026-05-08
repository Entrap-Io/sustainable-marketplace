import express from "express";
import { body } from "express-validator";
import { isMarket } from "../controllers/authMiddleware.js";
import { upload } from "../controllers/marketController.js";
import * as marketController from "../controllers/marketController.js";

const router = express.Router();
router.use(isMarket);

router.get("/dashboard", marketController.dashboard);
router.get("/profile", marketController.showProfile);

router.post("/profile", marketController.updateProfile);

router.get("/product/add", marketController.showAddProduct);

const productValidators = [
  body("title").notEmpty().withMessage("Title is required"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a positive number"),
  body("normal_price").isFloat({ min: 0.01 }).withMessage("Normal price must be greater than 0"),
  body("discounted_price").isFloat({ min: 0 }).withMessage("Discounted price is required")
    .custom((value, { req }) => {
      if (parseFloat(value) >= parseFloat(req.body.normal_price)) {
        throw new Error("Discounted price must be less than normal price");
      }
      return true;
    }),
  body("expiration_date").notEmpty().withMessage("Expiration date is required"),
];

router.post("/product/add", upload.single("image"), productValidators, marketController.addProduct);

router.get("/product/edit/:id", marketController.showEditProduct);

router.post("/product/edit/:id", upload.single("image"), productValidators, marketController.editProduct);

router.post("/product/delete/:id", marketController.deleteProduct);

export default router;
