import { STORE_KEYS } from "../models/storeMap.js";
import Product from "../models/productSchema.js";
import { StatusCodes } from "http-status-codes";
import normalizeDate from "../utils/normalizeDate.js"


function getInitialQuantity() {
    return STORE_KEYS.reduce((acc, store) => {
        acc[store] = 0;
        return acc;
    }, {});
};

async function findProduct(eanCode, expiresAt) {
    return await Product.findOne({
        eanCode,
        expiresAt
    });
}

export async function createProductService({ name, eanCode, expiresAt }) {

    const normalizedDate = normalizeDate(expiresAt);

    const existingProduct = await findProduct(eanCode, expiresAt);

    if (existingProduct) {
        const error = new Error("A product with a similar barcode and expiration date already exists in the database.");
        error.status = StatusCodes.CONFLICT;
        error.product = existingProduct;
        throw error;
    }

    const product = await Product.create({
        name,
        eanCode,
        expiresAt: normalizedDate,
        quantity: getInitialQuantity()
    });

    return product;
};

export async function updateProductService({ productId, store, quantity }) {

    if (!STORE_KEYS.includes(store)) {
        throw new Error("Loja inválida");
    };

    if (quantity < 0) {
        throw new Error("Quantidade não pode ser inferior a 0.")
    };

    const updateProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                [`quantity.${store}`]: quantity
            }
        },
        { new: true, runValidators: true }
    );

    if (!updateProduct) {
        const error = new Error("Produto não encontrado.");
        error.status = 404;
        throw error;
    }

    return updateProduct;
};

export async function expireSoonProductsService({ page = 1, limit = 15 }) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const futureDate = new Date(today);
    futureDate.setUTCDate(today.getUTCDate() + 15);

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        Product.find({
            expiresAt: { $gte: today, $lte: futureDate }
        })
            .sort({ expiresAt: 1 })
            .skip(skip)
            .limit(limit),

        Product.countDocuments({
            expiresAt: { $gte: today, $lte: futureDate }
        })
    ]);

    return {
        data: products,
        pagination: {
            totalItems: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            itemsPerPage: limit
        }
    };
}