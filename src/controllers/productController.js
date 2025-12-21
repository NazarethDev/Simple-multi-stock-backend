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
            .status(error.status || error.BAD_REQUEST)
            .json({
                error: error.message,
                error: error.product
            });
    };
};

export async function updateProductQuantity(req, res) {
    try {
        const { productId } = req.params;
        const { store, quantity } = req.body;

        const updatedProduct = await updateProductService({
            productId,
            store,
            quantity
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
        const { page = 1, limit = 15 } = req.query;
        const result = await expireSoonProductsService({
            page: Number(page),
            limit: Number(limit)
        });
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: error.message })
    };
}