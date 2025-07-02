
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { usePharmacy } from '@/contexts/PharmacyContext';
import { useToast } from '@/hooks/use-toast';
import { Product, ProductCategory } from '@/types/products';
import { Plus, Search, Package, AlertTriangle, Edit, Trash2 } from 'lucide-react';

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'medicamentos', label: 'Medicamentos' },
  { value: 'cuidado-personal', label: 'Cuidado Personal' },
  { value: 'vitaminas', label: 'Vitaminas' },
  { value: 'primeros-auxilios', label: 'Primeros Auxilios' },
  { value: 'cosmeticos', label: 'Cosméticos' },
  { value: 'higiene-bucal', label: 'Higiene Bucal' },
  { value: 'cuidado-infantil', label: 'Cuidado Infantil' },
  { value: 'otros', label: 'Otros' },
];

const ProductsManager = () => {
  const { products, addProduct, updateProduct, deleteProduct } = usePharmacy();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'medicamentos' as ProductCategory,
    description: '',
    price: 0,
    stock: 0,
    minStock: 0,
    barcode: '',
    supplier: '',
    expirationDate: '',
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'medicamentos',
      description: '',
      price: 0,
      stock: 0,
      minStock: 0,
      barcode: '',
      supplier: '',
      expirationDate: '',
    });
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
      toast({
        title: "Producto actualizado",
        description: "El producto se ha actualizado correctamente",
      });
    } else {
      addProduct(formData);
      toast({
        title: "Producto agregado",
        description: "El producto se ha agregado al inventario",
      });
    }
    
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      barcode: product.barcode || '',
      supplier: product.supplier,
      expirationDate: product.expirationDate,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`¿Estás seguro de eliminar ${product.name}?`)) {
      deleteProduct(product.id);
      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado del inventario",
      });
    }
  };

  const getCategoryLabel = (category: ProductCategory) => {
    return CATEGORIES.find(cat => cat.value === category)?.label || category;
  };

  const getStockStatus = (product: Product) => {
    if (product.stock <= product.minStock) {
      return { status: 'low', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    }
    return { status: 'normal', color: 'bg-green-100 text-green-800', icon: Package };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600">Administra el inventario de la farmacia</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pharmacy-gradient hover:opacity-90" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Modifica los datos del producto' : 'Ingresa los datos del nuevo producto'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select value={formData.category} onValueChange={(value: ProductCategory) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (S/.)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Actual</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minStock">Stock Mínimo</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Proveedor</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="barcode">Código de Barras</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expirationDate">Fecha de Expiración</Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-pharmacy-gradient hover:opacity-90">
                  {editingProduct ? 'Actualizar' : 'Agregar'} Producto
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          return (
            <Card key={product.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {product.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {getCategoryLabel(product.category)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    S/. {product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Badge className={stockStatus.color}>
                      <stockStatus.icon className="w-3 h-3 mr-1" />
                      Stock: {product.stock}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Proveedor:</strong> {product.supplier}</p>
                  <p><strong>Expira:</strong> {new Date(product.expirationDate).toLocaleDateString()}</p>
                  {product.barcode && (
                    <p><strong>Código:</strong> {product.barcode}</p>
                  )}
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza agregando tu primer producto al inventario'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductsManager;
