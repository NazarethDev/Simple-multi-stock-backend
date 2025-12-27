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
};

export async function getExpiredCostByStoreRepository(months) {
    const now = new Date();
    const pastDate = new Date();
    pastDate.setMonth(now.getMonth() - months);

    const result = await Product.aggregate([
        {
            $match: {
                expiresAt: {
                    $gte: pastDate,
                    $lte: now
                }
            }
        },
        {
            $project: {
                cost: 1,
                quantityArray: {
                    $objectToArray: "$quantity"
                }
            }
        },

        { $unwind: "quantityArray" },

        {
            $project: {
                store: "$quantityArray.k",
                totalCost: {
                    $multiply: ["$quantityArray.v", "$cost"]
                }
            }
        },
        {
            $group: {
                _id: "$store",
                total: { $sum: "$totalCost" }
            }
        }
    ]);

    return result

}