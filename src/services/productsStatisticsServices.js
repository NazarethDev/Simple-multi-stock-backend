import { StatusCodes } from "http-status-codes";
import { getExpiredProductsByStoreRpository, getExpiredCostByStoreRepository } from "../repositories/productStatistcsRepository.js";

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
};

export async function getExpiresCostsStatisticsService(months) {
    const parsedMonths = Number(months);

    if (![1, 2, 3].includes(parsedMonths)) {
        const error = new Error("Months must be 1, 2 or 3");
        error.status = StatusCodes.BAD_REQUEST;
        throw error;
    };

    const data = await getExpiredCostByStoreRepository(parsedMonths);

    const response = {};

    data.forEach(item => {
        response[item._id] = item.total;
    });

    return response;
}