import { STORE_KEYS } from "../models/storeMap.js";
import Product from "../models/productSchema.js";
import { StatusCodes } from "http-status-codes";
import normalizeDate from "../utils/normalizeDate.js";
import { findExpiringSoonProducts, findProductByEanCode } from "../repositories/productRepository.js"


function getInitialQuantity() {
    return STORE_KEYS.reduce((acc, store) => {
        acc[store] = 0;
        return acc;
    }, {});
}

async function findProduct(eanCode, expiresAt) {
    return await Product.findOne({
        eanCode,
        expiresAt
    });
};

export function calculateTotalQuantity(quantity = {}) {
    return Object.values(quantity)
        .reduce((sum, value) => sum + value, 0);
};


export async function createProductService({ name, eanCode, expiresAt }) {

    const normalizedDate = normalizeDate(expiresAt);

    const existingProduct = await findProduct(eanCode, expiresAt);

    if (existingProduct) {
        const error = new Error("A product with a similar barcode and expiration date already exists in the database.");
        error.status = StatusCodes.CONFLICT;
        error.product = existingProduct;
        throw error;
    }

    console.log("normalizedDate:", normalizedDate, normalizedDate instanceof Date);
    console.log("quantity:", getInitialQuantity());
    const product = await Product.create({
        name,
        eanCode,
        expiresAt: normalizedDate,
        quantity: getInitialQuantity()
    });

    return product;
};

export async function updateProductService({ productId, quantities }) {

    if (!quantities || typeof quantities !== "object") {
        throw new Error("Dados de quantidades enviados inválidos");
    }

    // valida tudo antes
    for (const [store, quantity] of Object.entries(quantities)) {
        if (!STORE_KEYS.includes(store)) {
            throw new Error(`Loja inválida: ${store}`);
        }

        if (quantity < 0) {
            throw new Error(`Quantidade inválida para ${store}`);
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                quantity: quantities
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedProduct) {
        const error = new Error("Produto não encontrado");
        error.status = StatusCodes.NOT_FOUND;
        throw error;
    }

    return updatedProduct;
}

export async function expireSoonProductsService({ page = 1, limit = 15, days = 7 }) {

    if (days < 0) {
        throw new Error("Datas devem ocorrer entre hoje e um dia futuro.")
    }

    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + days);
    endDate.setUTCHours(23, 59, 59, 999)

    const { products, total } = await findExpiringSoonProducts({
        startDate,
        endDate,
        page,
        limit
    });

    const data = products.map(product => {
        const obj = product.toObject();

        return {
            ...obj,
            totalQuantity: calculateTotalQuantity(obj.quantity)
        };
    });

    return {
        data,
        filter: {
            days,
            from: startDate,
            to: endDate
        },
        pagination: {
            totalItems: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            itemsPerPage: limit
        }
    };
};

export async function findByProductEanCodeService(eanCode) {
    const products = await findProductByEanCode(eanCode);

    if (products.length === 0) {
        throw new Error("Ean code not found")
    }

    const data = products.map(product => {
        const obj = product.toObject();

        return {
            ...obj,
            totalQuantity: calculateTotalQuantity(obj.quantity)
        };
    });

    return data;
}