
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  stock: number;
  minStock: number;
  barcode?: string;
  supplier: string;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory = 
  | 'medicamentos'
  | 'cuidado-personal'
  | 'vitaminas'
  | 'primeros-auxilios'
  | 'cosmeticos'
  | 'higiene-bucal'
  | 'cuidado-infantil'
  | 'otros';

export interface Sale {
  id: string;
  products: SaleItem[];
  total: number;
  employeeId: string;
  customerName?: string;
  date: string;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia';
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
