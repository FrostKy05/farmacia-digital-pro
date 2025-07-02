
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePharmacy } from '@/contexts/PharmacyContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  DollarSign,
  Users
} from 'lucide-react';

const Dashboard = () => {
  const { products, sales, getLowStockProducts } = usePharmacy();
  const { user } = useAuth();
  
  const lowStockProducts = getLowStockProducts();
  const totalProducts = products.length;
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const todaySales = sales.filter(sale => 
    new Date(sale.date).toDateString() === new Date().toDateString()
  ).length;

  const stats = [
    {
      title: 'Productos Total',
      value: totalProducts,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Ventas del Día',
      value: todaySales,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Stock Bajo',
      value: lowStockProducts.length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Ingresos Total',
      value: `S/. ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-purple-800">Panel de Control</h1>
          <p className="text-purple-600">Bienvenido, {user?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-purple-500">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-purple-800">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos con stock bajo */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              Productos con Stock Bajo
            </CardTitle>
            <CardDescription>
              Productos que necesitan reabastecimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-purple-500 text-center py-4">
                ¡Excelente! Todos los productos tienen stock suficiente
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                    <div>
                      <p className="font-medium text-purple-800">{product.name}</p>
                      <p className="text-sm text-purple-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        Stock: {product.stock}
                      </p>
                      <p className="text-xs text-purple-400">
                        Mín: {product.minStock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumen de ventas recientes */}
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-800">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Ventas Recientes
            </CardTitle>
            <CardDescription>
              Últimas transacciones realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sales.length === 0 ? (
              <p className="text-purple-500 text-center py-4">
                No hay ventas registradas aún
              </p>
            ) : (
              <div className="space-y-3">
                {sales.slice(-5).reverse().map((sale) => (
                  <div key={sale.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                    <div>
                      <p className="font-medium text-purple-800">
                        Venta #{sale.id.slice(-4)}
                      </p>
                      <p className="text-sm text-purple-500">
                        {sale.products.length} productos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        S/. {sale.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-purple-400">
                        {new Date(sale.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
