export function calculateTotalQuantity(quantity = {}) {
    return Object.values(quantity)
        .reduce((sum, value) => sum + value, 0);
}
