import mongoose from "mongoose";
import { STORE_KEYS } from "./storeMap.js";

const THREE_MONTHS = 60 * 60 * 24 * 90

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    eanCode: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: THREE_MONTHS }
    },
    quantity: {
        type: Map,
        of: {
            type: Number,
            min: 0
        },
        default: {},

        validate: {
            validator: function (map) {
                for (const key of map.keys()) {
                    if (!STORE_KEYS.includes(key)) {
                        return false;
                    };
                }
                return true;
            },
            message: "Loja inválida."
        }
    },
});

productSchema.index(
    { eanCode: 1, expiresAt: 1 },
    { unique: true }
);

export default mongoose.model("Product", productSchema);
