import { Router } from "express";
import { createProduct, updateProductQuantity, getExpireSoonProducts, findByProductEanCode, updateNameOrProductCostController } from "../controllers/productController.js";
import { getExpiredProductsByStoreController, getExpiredCostStatisticsController } from "../controllers/productStatistics.Controller.js"
const router = Router();

router.post("/", createProduct);

router.put("/quantity/:productId", updateProductQuantity);

router.patch("/update-cost-and-name/:id", updateNameOrProductCostController);

router.get("/expiring-soon", getExpireSoonProducts);

router.get("/ean/:eanCode/", findByProductEanCode);

router.get("/statistics/expired-products-by-store", getExpiredProductsByStoreController);

router.get("/statistics/expired-products-costs-by-store/:months", getExpiredCostStatisticsController);


export default router;