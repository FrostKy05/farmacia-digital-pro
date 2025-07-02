
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePharmacy } from '@/contexts/PharmacyContext';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Shield,
  User,
  Pill
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: BarChart3,
  },
  {
    title: 'Productos',
    url: '/productos',
    icon: Package,
  },
  {
    title: 'Punto de Venta',
    url: '/ventas',
    icon: ShoppingCart,
  },
  {
    title: 'Configuración',
    url: '/configuracion',
    icon: Settings,
    adminOnly: true,
  },
];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const { user, logout } = useAuth();
  const { pharmacyName } = usePharmacy();
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getNavClass = (path: string) => {
    return isActive(path) 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-accent hover:text-accent-foreground";
  };

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible>
      <SidebarHeader className="border-b">
        <div className="p-4">
          {!collapsed ? (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-pharmacy-gradient rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">{pharmacyName}</span>
              </div>
              <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
            </div>
          ) : (
            <div className="w-8 h-8 bg-pharmacy-gradient rounded-lg flex items-center justify-center mx-auto">
              <Pill className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClass(item.url)}
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="p-4 space-y-4">
          {!collapsed && (
            <div className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
              <div className={`p-2 rounded-full ${user?.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                {user?.role === 'admin' ? (
                  <Shield className="w-4 h-4 text-purple-600" />
                ) : (
                  <User className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="ml-2">Cerrar Sesión</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
