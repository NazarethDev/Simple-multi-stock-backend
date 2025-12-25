import Product from "../models/productSchema.js";

export async function findExpiringSoonProducts({
    startDate,
    endDate,
    page,
    limit
}) {
    const skip = (page - 1) * limit;

    const query = {
        expiresAt: {
            $gte: startDate,
            $lte: endDate
        }
    };

    const [products, total] = await Promise.all([
        Product.find(query)
            .sort({ expiresAt: 1 })
            .skip(skip)
            .limit(limit),

        Product.countDocuments(query)
    ]);

    return {
        products,
        total
    };
}