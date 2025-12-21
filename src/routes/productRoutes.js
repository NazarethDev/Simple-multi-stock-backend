import { Router } from "express";
import { createProduct, updateProductQuantity, getExpireSoonProducts } from "../controllers/productController.js";

const router = Router();

router.post("/", createProduct);

router.put("/quantity/:productId", updateProductQuantity);

router.get("/expiring-soon", getExpireSoonProducts)

export default router;