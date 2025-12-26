import { StatusCodes } from "http-status-codes";
import { getExpiredProductsByStoreRpository } from "../repositories/productStatistcsRepository.js";

export async function expiredProductsByStoreService(months) {
    const allowedMonths = [1, 2, 3];

    if (!allowedMonths.includes(Number(months))) {
        const error = new Error("Invalid search period in months.");
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    };

    const stats = await getExpiredProductsByStoreRpository(Number(months));

    return stats.map(item => ({
        store: item._id,
        totalExpiredProducts: item.totalExpiredProducts
    }));
}