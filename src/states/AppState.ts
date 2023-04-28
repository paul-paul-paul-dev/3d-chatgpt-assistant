import { create } from "zustand";

export enum CommerceButtonType {
    BUY,
    SELL,
    NONE
} 

export function getCommerButtonTypeName(type: CommerceButtonType) {
    switch (type) {
        case CommerceButtonType.BUY:
          return "BUY";
        case CommerceButtonType.SELL:
          return "SELL";
        case CommerceButtonType.NONE:
          return "NONE"
      }
}


export interface Stock {
    companyName: string;
    tickerSymbol: string;
    currentPrice: number;

}

interface AppState {
    stock: Stock | undefined;
    commerceButton: CommerceButtonType;
    changeStock: (newStock: Stock) => void;
    changeCommerceButton: (newCommerceButton: CommerceButtonType) => void;
  }
  
  export const useAppStore = create<AppState>((set) => ({
    stock: undefined, // {companyName: "Apple", tickerSymbol:"AAPL", currentPrice: 150.23}
    commerceButton: CommerceButtonType.NONE,
    changeStock: (newStock) =>
      set(() => ({
        stock: newStock,
      })),
      changeCommerceButton: (newCommerceButton) =>
      set(() => ({
        commerceButton: newCommerceButton,
      })),
  }));
  