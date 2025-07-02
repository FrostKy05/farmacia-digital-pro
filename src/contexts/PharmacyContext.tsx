
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Sale } from '@/types/products';

interface PharmacyContextType {
  pharmacyName: string;
  setPharmacyName: (name: string) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  getLowStockProducts: () => Product[];
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

// Productos de ejemplo
const DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'medicamentos',
    description: 'Analgésico y antipirético',
    price: 12.50,
    stock: 150,
    minStock: 20,
    barcode: '7501234567890',
    supplier: 'Laboratorios ABC',
    expirationDate: '2025-12-31',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Shampoo Anticaspa',
    category: 'cuidado-personal',
    description: 'Shampoo medicinal para caspa',
    price: 28.90,
    stock: 45,
    minStock: 10,
    supplier: 'Cosmética Salud',
    expirationDate: '2026-06-30',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Vitamina C 1000mg',
    category: 'vitaminas',
    description: 'Suplemento vitamínico',
    price: 35.00,
    stock: 8,
    minStock: 15,
    supplier: 'Vitaminas Pro',
    expirationDate: '2025-08-15',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '4',
    name: 'Pañales Talla M',
    category: 'cuidado-infantil',
    description: 'Pañales desechables talla mediana',
    price: 22.50,
    stock: 75,
    minStock: 25,
    supplier: 'Baby Care',
    expirationDate: '2027-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pharmacyName, setPharmacyName] = useState('Farmacia Digital Pro');
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    // Cargar datos guardados
    const savedName = localStorage.getItem('pharmacy_name');
    const savedProducts = localStorage.getItem('pharmacy_products');
    const savedSales = localStorage.getItem('pharmacy_sales');
    
    if (savedName) setPharmacyName(savedName);
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedSales) setSales(JSON.parse(savedSales));
  }, []);

  const updatePharmacyName = (name: string) => {
    setPharmacyName(name);
    localStorage.setItem('pharmacy_name', name);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('pharmacy_products', JSON.stringify(updatedProducts));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updatedProducts = products.map(product => 
      product.id === id 
        ? { ...product, ...updates, updatedAt: new Date().toISOString() }
        : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('pharmacy_products', JSON.stringify(updatedProducts));
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('pharmacy_products', JSON.stringify(updatedProducts));
  };

  const addSale = (saleData: Omit<Sale, 'id' | 'date'>) => {
    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    
    // Actualizar stock de productos
    const updatedProducts = products.map(product => {
      const saleItem = saleData.products.find(item => item.productId === product.id);
      if (saleItem) {
        return { ...product, stock: product.stock - saleItem.quantity };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    localStorage.setItem('pharmacy_products', JSON.stringify(updatedProducts));
    
    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    localStorage.setItem('pharmacy_sales', JSON.stringify(updatedSales));
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.stock <= product.minStock);
  };

  return (
    <PharmacyContext.Provider value={{
      pharmacyName,
      setPharmacyName: updatePharmacyName,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      sales,
      addSale,
      getLowStockProducts,
    }}>
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (context === undefined) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
