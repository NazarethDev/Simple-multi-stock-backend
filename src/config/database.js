import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_PATH);
        console.log('Database successfully connected ✅')
    } catch (error) {
        console.error('Database connection error ❌', error.message)
    };
}