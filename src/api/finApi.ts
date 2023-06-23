export function getStockPrice(ticker: string) {
    return Math.floor(Math.random() * (300 - 150 + 1)) + 150;
}