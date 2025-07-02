
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { usePharmacy } from '@/contexts/PharmacyContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Product, SaleItem } from '@/types/products';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Search,
  Receipt,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react';

const SalesPoint = () => {
  const { products, addSale } = usePharmacy();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo');
  const [isProcessing, setIsProcessing] = useState(false);

  const availableProducts = products.filter(product => 
    product.stock > 0 && 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
            : item
        ));
      } else {
        toast({
          title: "Stock insuficiente",
          description: `Solo hay ${product.stock} unidades disponibles`,
          variant: "destructive",
        });
      }
    } else {
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        subtotal: product.price,
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity === 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else if (newQuantity <= product.stock) {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.unitPrice }
          : item
      ));
    } else {
      toast({
        title: "Stock insuficiente",
        description: `Solo hay ${product.stock} unidades disponibles`,
        variant: "destructive",
      });
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const processSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos antes de procesar la venta",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular procesamiento

      const sale = {
        products: cart,
        total: getTotalAmount(),
        employeeId: user!.id,
        customerName: customerName || undefined,
        paymentMethod,
      };

      addSale(sale);

      toast({
        title: "Venta procesada",
        description: `Venta por S/. ${getTotalAmount().toFixed(2)} completada exitosamente`,
      });

      // Limpiar el carrito y formulario
      setCart([]);
      setCustomerName('');
      setPaymentMethod('efectivo');
      setSearchTerm('');

    } catch (error) {
      toast({
        title: "Error al procesar venta",
        description: "Intenta nuevamente",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentIcons = {
    efectivo: Banknote,
    tarjeta: CreditCard,
    transferencia: Smartphone,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      {/* Panel de productos */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Punto de Venta</h1>
          <p className="text-gray-600">Gestiona las ventas de la farmacia</p>
        </div>

        {/* Búsqueda de productos */}
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar productos por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableProducts.slice(0, 8).map((product) => (
            <Card key={product.id} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold text-green-600">S/. {product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addToCart(product)}
                    className="bg-pharmacy-gradient hover:opacity-90"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {availableProducts.length === 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron productos disponibles</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Panel del carrito */}
      <div className="space-y-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Carrito de Compras
            </CardTitle>
            <CardDescription>
              {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>El carrito está vacío</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-600">S/. {item.unitPrice.toFixed(2)} c/u</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(item.productId)}
                          className="w-8 h-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">S/. {getTotalAmount().toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Información de venta */}
        {cart.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Información de Venta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre del Cliente (Opcional)</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nombre del cliente"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Método de Pago</label>
                <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">
                      <div className="flex items-center">
                        <Banknote className="w-4 h-4 mr-2" />
                        Efectivo
                      </div>
                    </SelectItem>
                    <SelectItem value="tarjeta">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Tarjeta
                      </div>
                    </SelectItem>
                    <SelectItem value="transferencia">
                      <div className="flex items-center">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Transferencia
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={processSale}
                disabled={isProcessing}
                className="w-full bg-pharmacy-gradient hover:opacity-90"
              >
                {isProcessing ? (
                  "Procesando..."
                ) : (
                  <>
                    <Receipt className="w-4 h-4 mr-2" />
                    Procesar Venta
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SalesPoint;
