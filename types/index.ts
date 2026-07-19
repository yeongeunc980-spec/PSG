export interface Sale {
  id: string;
  companyName: string;
  saleDate: string;
  productName: string;
  quantity: number;
  saleAmount: number;
  paymentMethod: 'cash' | 'transfer' | 'credit';
  signature: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreState {
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSale: (id: string, sale: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  setSales: (sales: Sale[]) => void;
  getSaleById: (id: string) => Sale | undefined;
  getSalesByDate: (date: string) => Sale[];
  getAllSales: () => Sale[];
}
