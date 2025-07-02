
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, Users, Pill } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema de farmacia",
      });
    } else {
      toast({
        title: "Error de autenticación",
        description: "Credenciales incorrectas",
        variant: "destructive",
      });
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'employee') => {
    if (role === 'admin') {
      setEmail('admin@farmacia.com');
      setPassword('admin123');
    } else {
      setEmail('maria@farmacia.com');
      setPassword('empleado123');
    }
  };

  return (
    <div className="min-h-screen bg-pharmacy-light flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fadeIn">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-pharmacy-gradient rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Pill className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Farmacia Digital Pro</h1>
          <p className="text-purple-600 mt-2 font-medium">Sistema de gestión farmacéutica</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-purple-800">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-purple-700">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@farmacia.com"
                  className="border-purple-200 focus:border-purple-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-purple-700">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="border-purple-200 focus:border-purple-400"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-pharmacy-gradient hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="text-sm text-purple-600 text-center font-medium">
                Credenciales de prueba:
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('admin')}
                  className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('employee')}
                  className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Users className="w-3 h-3 mr-1" />
                  Empleado
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
