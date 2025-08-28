import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = ({ restricted = false }) => {
  const { isAuthenticated } = useAuth();
  
  // Si la ruta es restringida (como login/registro) y el usuario está autenticado,
  // redirigir a la página principal
  if (isAuthenticated && restricted) {
    return <Navigate to="/" replace />;
  }

  // Si no está autenticado o la ruta no es restringida, renderizar las rutas hijas
  return <Outlet />;
};

export default PublicRoute;
