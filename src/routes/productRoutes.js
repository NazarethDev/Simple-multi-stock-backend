import { Router } from "express";
import { createProduct, updateProductQuantity, getExpireSoonProducts, findByProductEanCode } from "../controllers/productController.js";
import { getExpiredProductsByStore } from "../controllers/productStatistics.Controller.js"
const router = Router();

router.post("/", createProduct);

router.put("/quantity/:productId", updateProductQuantity);

router.get("/expiring-soon", getExpireSoonProducts);

router.get("/ean/:eanCode/", findByProductEanCode);

router.get("/statistics/expired-products-by-store", getExpiredProductsByStore);

export default router;