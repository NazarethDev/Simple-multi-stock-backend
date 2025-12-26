import Product from "../models/productSchema.js";

export async function getExpiredProductsByStoreRpository(months) {

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (months * 30));

    return Product.aggregate([
        {
            $match: {
                expiresAt: {
                    $gte: startDate,
                    $lt: endDate
                }
            }
        },
        {
            $project: {
                quantityArray: { $objectToArray: "$quantity" }
            }
        },
        {
            $unwind: "$quantityArray"
        },
        {
            $match: {
                "quantityArray.v": { $gt: 0 }
            }
        },
        {
            $group: {
                _id: "$quantityArray.k",
                totalExpiredProducts: { $sum: 1 }
            }
        },
        {
            $sort: { totalExpiredProducts: -1 }
        }
    ]);
}