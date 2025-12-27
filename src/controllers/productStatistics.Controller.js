import { StatusCodes } from "http-status-codes";
import { expiredProductsByStoreService, getExpiresCostsStatisticsService } from "../services/productsStatisticsServices.js";

export async function getExpiredProductsByStoreController(req, res) {

    try {
        const { months } = req.query;

        console.log("Query recebida:", req.query);
        console.log("Months:", req.query.months);
        const data = await expiredProductsByStoreService(months);

        return res
            .status(StatusCodes.OK)
            .json(data);
    } catch (error) {
        return res
            .status(error.status || StatusCodes.BAD_REQUEST)
            .json({ error: error.message });
    };
};

export async function getExpiredCostStatisticsController(req, res) {
    try {
        const { months } = req.params;
        const result = await getExpiresCostsStatisticsService(months);

        return res
            .status(StatusCodes.OK)
            .json(result);

    } catch (error) {
        return res
            .status(error.status || StatusCodes.BAD_REQUEST)
            .json({ error: error.message });
    };
}