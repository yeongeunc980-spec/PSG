import { create } from 'zustand';
import { StoreState, Sale } from '../types/index';
import { v4 as uuidv4 } from 'uuid';

export const useStore = create<StoreState>((set, get) => ({
  sales: [],

  addSale: (sale) => {
    const newSale: Sale = {
      ...sale,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      sales: [...state.sales, newSale].sort(
        (a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
      ),
    }));
  },

  updateSale: (id, updatedData) => {
    set((state) => ({
      sales: state.sales.map((sale) =>
        sale.id === id
          ? { ...sale, ...updatedData, updatedAt: new Date().toISOString() }
          : sale
      ),
    }));
  },

  deleteSale: (id) => {
    set((state) => ({
      sales: state.sales.filter((sale) => sale.id !== id),
    }));
  },

  setSales: (sales) => {
    set({
      sales: sales.sort(
        (a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
      ),
    });
  },

  getSaleById: (id) => {
    return get().sales.find((sale) => sale.id === id);
  },

  getSalesByDate: (date) => {
    return get().sales.filter((sale) => sale.saleDate === date);
  },

  getAllSales: () => {
    return get().sales;
  },
}));
