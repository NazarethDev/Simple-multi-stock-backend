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
        type: Object,
        default: {},

        validate: {
            validator: function (obj) {
                for (const key of Object.keys(obj)) {
                    if (!STORE_KEYS.includes(key)) {
                        return false;
                    };
                }
                return true;
            },
            message: "Loja inválida."
        }
    },
    cost: {
        type: Number,
        required: true,
        min: [0, "O custo não pode ser negativo"]
    }
});

productSchema.index(
    { eanCode: 1, expiresAt: 1 },
    { unique: true }
);

productSchema.virtual("totalQuantity").get(function () {
    return Object.values(this.quantity || {}).reduce((sum, v) => sum + v, 0);
});

productSchema.virtual("totalCost").get(function () {
    return (this.totalQuantity || 0) * (this.cost || 0);
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true })

export default mongoose.model("Product", productSchema);
