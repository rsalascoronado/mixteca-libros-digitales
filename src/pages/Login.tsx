
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from '@/types';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('estudiante');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if email is admin
  useEffect(() => {
    setIsAdmin(email.toLowerCase() === 'admin@mixteco.utm.mx' || email.toLowerCase() === 'adminadmin@mixteco.utm.mx');
  }, [email]);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Skip email validation for admin accounts
    if (isAdmin) {
      try {
        const success = await login(email, password);
        if (success) {
          navigate('/');
        } else {
          setError('Credenciales incorrectas. Inténtalo de nuevo.');
        }
      } catch (error) {
        setError('Error al iniciar sesión. Inténtalo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // For non-admin users, enforce email validation
    if (selectedRole === 'estudiante') {
      if (!email.endsWith('@gs.utm.mx')) {
        setError('Los estudiantes deben usar su correo institucional (@gs.utm.mx)');
        setIsLoading(false);
        return;
      }
    } else if (!email.endsWith('@mixteco.utm.mx')) {
      setError('Los usuarios del personal deben usar su correo institucional (@mixteco.utm.mx)');
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Credenciales incorrectas. Inténtalo de nuevo.');
      }
    } catch (error) {
      setError('Error al iniciar sesión. Inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-10 px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Acceso al Sistema</CardTitle>
            <CardDescription className="text-center">
              Ingresa con tu correo institucional
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@mixteco.utm.mx"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                {!isAdmin && (
                  <div className="grid gap-2">
                    <Label htmlFor="role">Rol de Usuario</Label>
                    <Select
                      value={selectedRole}
                      onValueChange={(value: UserRole) => setSelectedRole(value)}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Selecciona tu rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estudiante">Estudiante</SelectItem>
                        <SelectItem value="profesor">Profesor</SelectItem>
                        <SelectItem value="bibliotecario">Bibliotecario</SelectItem>
                        <SelectItem value="administrativo">Administrativo</SelectItem>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-500">
              Para fines de demostración, puedes usar cualquiera de estos correos:
            </div>
            <div className="text-xs text-center space-y-1">
              <div><strong>Admin:</strong> admin@mixteco.utm.mx</div>
              <div><strong>Bibliotecario:</strong> biblioteca@mixteco.utm.mx</div>
              <div><strong>Profesor:</strong> profesor@mixteco.utm.mx</div>
              <div><strong>Estudiante:</strong> estudiante@gs.utm.mx</div>
              <div><strong>Contraseña:</strong> cualquier valor</div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;
