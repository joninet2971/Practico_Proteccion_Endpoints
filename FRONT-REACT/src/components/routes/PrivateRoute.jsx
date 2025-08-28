import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

const PrivateRoute = ({ roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  // Si aún está cargando, mostrar un loader o null
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/inicio-sesion" state={{ from: window.location.pathname }} replace />;
  }

  // Si se especificaron roles y el usuario no tiene ninguno de ellos, redirigir
  if (roles.length > 0 && !roles.includes(user?.rol)) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  // Si el usuario está autenticado y tiene los roles necesarios, renderizar las rutas hijas
  return <Outlet />;
};

export default PrivateRoute;
