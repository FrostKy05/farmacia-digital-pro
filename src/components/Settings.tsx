
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { usePharmacy } from '@/contexts/PharmacyContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  Store, 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  Shield,
  User,
  Save
} from 'lucide-react';

const Settings = () => {
  const { pharmacyName, setPharmacyName } = usePharmacy();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [newPharmacyName, setNewPharmacyName] = useState(pharmacyName);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'employee' as 'admin' | 'employee',
    password: '',
  });

  // Usuarios de ejemplo (en producción vendría de base de datos)
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Admin Principal',
      email: 'admin@farmacia.com',
      role: 'admin' as const,
      isActive: true,
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria@farmacia.com',
      role: 'employee' as const,
      isActive: true,
      createdAt: '2024-01-15',
    },
  ]);

  const handleSavePharmacyName = () => {
    setPharmacyName(newPharmacyName);
    toast({
      title: "Configuración guardada",
      description: "El nombre de la farmacia ha sido actualizado",
    });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUserData = {
      id: Date.now().toString(),
      ...newUser,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    
    setUsers([...users, newUserData]);
    setNewUser({ name: '', email: '', role: 'employee', password: '' });
    setIsAddUserDialogOpen(false);
    
    toast({
      title: "Usuario agregado",
      description: `Usuario ${newUser.name} creado exitosamente`,
    });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
    
    const targetUser = users.find(u => u.id === userId);
    toast({
      title: "Estado actualizado",
      description: `Usuario ${targetUser?.name} ${targetUser?.isActive ? 'desactivado' : 'activado'}`,
    });
  };

  const deleteUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser && window.confirm(`¿Estás seguro de eliminar a ${targetUser.name}?`)) {
      setUsers(users.filter(u => u.id !== userId));
      toast({
        title: "Usuario eliminado",
        description: `Usuario ${targetUser.name} eliminado del sistema`,
      });
    }
  };

  // Solo administradores pueden acceder a ciertas funciones
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <SettingsIcon className="w-8 h-8 mr-3" />
          Configuración
        </h1>
        <p className="text-gray-600 mt-2">Administra la configuración del sistema</p>
      </div>

      {/* Configuración de la Farmacia */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="w-5 h-5 mr-2" />
            Información de la Farmacia
          </CardTitle>
          <CardDescription>
            Configura los datos básicos de tu farmacia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pharmacyName">Nombre de la Farmacia</Label>
            <div className="flex space-x-2">
              <Input
                id="pharmacyName"
                value={newPharmacyName}
                onChange={(e) => setNewPharmacyName(e.target.value)}
                placeholder="Nombre de tu farmacia"
                className="flex-1"
              />
              <Button
                onClick={handleSavePharmacyName}
                disabled={newPharmacyName === pharmacyName}
                className="bg-pharmacy-gradient hover:opacity-90"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Vista Previa</h4>
            <p className="text-blue-800 text-lg font-semibold">{newPharmacyName}</p>
          </div>
        </CardContent>
      </Card>

      {/* Gestión de Usuarios - Solo para Administradores */}
      {isAdmin && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Gestión de Usuarios
                </CardTitle>
                <CardDescription>
                  Administra los usuarios del sistema
                </CardDescription>
              </div>
              
              <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-pharmacy-gradient hover:opacity-90">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                      Crea un nuevo usuario para el sistema
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="userName">Nombre Completo</Label>
                      <Input
                        id="userName"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="userEmail">Correo Electrónico</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="userRole">Rol</Label>
                      <Select value={newUser.role} onValueChange={(value: 'admin' | 'employee') => setNewUser({ ...newUser, role: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              Empleado
                            </div>
                          </SelectItem>
                          <SelectItem value="admin">
                            <div className="flex items-center">
                              <Shield className="w-4 h-4 mr-2" />
                              Administrador
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="userPassword">Contraseña Temporal</Label>
                      <Input
                        id="userPassword"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-pharmacy-gradient hover:opacity-90">
                        Crear Usuario
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((userData) => (
                <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${userData.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                      {userData.role === 'admin' ? (
                        <Shield className={`w-4 h-4 ${userData.role === 'admin' ? 'text-purple-600' : 'text-blue-600'}`} />
                      ) : (
                        <User className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{userData.name}</h4>
                      <p className="text-sm text-gray-600">{userData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={userData.role === 'admin' ? 'default' : 'secondary'}>
                      {userData.role === 'admin' ? 'Administrador' : 'Empleado'}
                    </Badge>
                    <Badge variant={userData.isActive ? 'default' : 'destructive'}>
                      {userData.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleUserStatus(userData.id)}
                    >
                      {userData.isActive ? 'Desactivar' : 'Activar'}
                    </Button>
                    
                    {userData.id !== user?.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteUser(userData.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información del Usuario Actual */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Mi Perfil
          </CardTitle>
          <CardDescription>
            Información de tu cuenta actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`p-3 rounded-full ${user?.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                {user?.role === 'admin' ? (
                  <Shield className="w-6 h-6 text-purple-600" />
                ) : (
                  <User className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{user?.name}</h4>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <Badge className="mt-2" variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                  {user?.role === 'admin' ? 'Administrador' : 'Empleado'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permisos por Rol */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Permisos del Sistema</CardTitle>
          <CardDescription>
            Funcionalidades disponibles según el rol del usuario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-purple-600" />
                Administrador
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✅ Gestión completa de productos</li>
                <li>✅ Realizar ventas</li>
                <li>✅ Ver todas las estadísticas</li>
                <li>✅ Gestionar usuarios</li>
                <li>✅ Configurar sistema</li>
                <li>✅ Acceso completo</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600" />
                Empleado
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✅ Ver productos</li>
                <li>✅ Realizar ventas</li>
                <li>✅ Ver estadísticas básicas</li>
                <li>❌ Gestionar usuarios</li>
                <li>❌ Modificar configuración</li>
                <li>❌ Eliminar productos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
