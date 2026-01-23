import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import Swal from 'sweetalert2';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userLoggedIn = localStorage.getItem('userLoggedIn');
      
      if (token && userLoggedIn === 'true') {
        try {
          const response = await authAPI.getProfile();
          const userData = response.data.user || response.data;
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error verificando autenticación:', error);
          // Limpiar datos inválidos
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userName', userData.nombre || userData.name || email.split('@')[0]);
      localStorage.setItem('userRole', userData.rol || userData.role || 'cliente');
      
      if (userData.photo) {
        localStorage.setItem('userPhoto', userData.photo);
      }

      setUser(userData);
      setIsAuthenticated(true);

      await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `Hola ${userData.nombre || userData.name || 'Usuario'}`,
        timer: 2000,
        showConfirmButton: false
      });

      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
      });
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        timer: 3000
      });

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrar usuario';
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
      });
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.log('Error en logout del servidor:', error);
    }

    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userPhoto');

    setUser(null);
    setIsAuthenticated(false);

    await Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      text: '¡Hasta pronto!',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = response.data.user || response.data;
      
      setUser(prev => ({ ...prev, ...updatedUser }));
      
      // Actualizar localStorage
      if (updatedUser.nombre) localStorage.setItem('userName', updatedUser.nombre);
      if (updatedUser.photo) localStorage.setItem('userPhoto', updatedUser.photo);

      await Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        timer: 1500,
        showConfirmButton: false
      });

      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar perfil';
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
      });
      return { success: false, error: message };
    }
  };

  const isAdmin = () => {
    return user?.rol === 'admin' || user?.role === 'admin' || 
           localStorage.getItem('userRole') === 'admin';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
