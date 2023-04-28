export function parseGetCurrentPrice(input: string): { stockName: string } | null {
    const regex = /^\/getCurrentPrice\s+(\w+)$/i;
    const match = input.match(regex);
    if (match) {
      return {stockName: match[1].toUpperCase()}; // return the STOCK_NAME in uppercase
    }
    return null; // return null if the input does not match the pattern
  }

export function parseSellStockAmount(input: string): { stockName: string, amount: number } | null {
    const buyCommandRegex = /^\/sell\s+(\w+)\s+(\d+)$/;
  
    const match = input.match(buyCommandRegex);
  
    if (match) {
      const stockName = match[1];
      const amount = parseInt(match[2], 10);
      return { stockName, amount };
    } else {
      return null;
    }
  }


export function parseBuyStockAmount(input: string): { stockName: string, amount: number } | null {
    const buyCommandRegex = /^\/buy\s+(\w+)\s+(\d+)$/;
  
    const match = input.match(buyCommandRegex);
  
    if (match) {
      const stockName = match[1];
      const amount = parseInt(match[2], 10);
      return { stockName, amount };
    } else {
      return null;
    }
  }