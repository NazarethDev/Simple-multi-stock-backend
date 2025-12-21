import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS bloqueado para esta origem"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

export default corsOptions;
