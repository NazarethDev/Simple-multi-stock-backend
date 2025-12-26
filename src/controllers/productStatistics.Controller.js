import { StatusCodes } from "http-status-codes";
import { expiredProductsByStoreService } from "../services/productsStatisticsServices.js";

export async function getExpiredProductsByStore(req, res) {

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
    }
}