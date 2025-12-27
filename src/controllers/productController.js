import { createProductService, updateProductQuantityService, expireSoonProductsService, findByProductEanCodeService, updateProductCostAndNameService } from "../services/productService.js";
import { StatusCodes } from "http-status-codes";

export async function createProduct(req, res) {
    try {
        const { name, eanCode, expiresAt, cost } = req.body;

        const product = await createProductService({
            name,
            eanCode,
            expiresAt,
            cost
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

        const updatedProduct = await updateProductQuantityService({
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

export async function findByProductEanCode(req, res) {
    try {
        const { eanCode } = req.params;

        const products = await findByProductEanCodeService(eanCode);

        return res.status(StatusCodes.OK).json(products);

    } catch (error) {

        return res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
}

export async function updateNameOrProductCostController(req, res) {
    try {
        const { id } = req.params;
        const { productName, productCost } = req.body;


        console.log("ID recebido: ", id)
        const updatedProduct = await updateProductCostAndNameService({ id, productName, productCost });

        return res
            .status(StatusCodes.OK)
            .json(updatedProduct);
    } catch (error) {
        return res
            .status(error.status || StatusCodes.BAD_REQUEST)
            .json({ error: error.message });
    }
}