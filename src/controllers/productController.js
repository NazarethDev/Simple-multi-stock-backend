import { createProductService, updateProductService, expireSoonProductsService } from "../services/productService.js";
import { StatusCodes } from "http-status-codes";

export async function createProduct(req, res) {
    try {
        const { name, eanCode, expiresAt } = req.body;

        const product = await createProductService({
            name,
            eanCode,
            expiresAt
        });

        return res.status(StatusCodes.CREATED).json(product)

    } catch (error) {
        return res
            .status(error.status || StatusCodes.BAD_REQUEST)
            .json({
                error: error.message,
                error: error.product
            });
    };
};

export async function updateProductQuantity(req, res) {
    try {
        const { productId } = req.params;
        const { quantities } = req.body;

        const updatedProduct = await updateProductService({
            productId,
            quantities
        });

        return res
            .status(StatusCodes.OK)
            .json(updatedProduct);

    } catch (error) {
        return res
            .status(error.status || StatusCodes.BAD_REQUEST)
            .json({ error: error.message });
    };
};

export async function getExpireSoonProducts(req, res) {
    try {
        const {
            page = req.page,
            limit = req.limit,
            days = req.days
        } = req.query;
        const result = await expireSoonProductsService({
            page: Number(page),
            limit: Number(limit),
            days: Number(days)
        });
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: error.message })
    };
}