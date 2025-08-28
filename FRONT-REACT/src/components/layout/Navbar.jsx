import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/inicio-sesion');
  };

  // Elementos del menú para usuarios no autenticados
  const publicItems = [
    {
      label: 'Inicio',
      icon: 'pi pi-fw pi-home',
      command: () => navigate('/')
    },
    {
      label: 'Iniciar Sesión',
      icon: 'pi pi-fw pi-sign-in',
      command: () => navigate('/inicio-sesion')
    },
    {
      label: 'Registrarse',
      icon: 'pi pi-fw pi-user-plus',
      command: () => navigate('/registro')
    }
  ];

  // Elementos del menú para usuarios autenticados
  const privateItems = [
    {
      label: 'Inicio',
      icon: 'pi pi-fw pi-home',
      command: () => navigate('/')
    },
    {
      label: 'Productos',
      icon: 'pi pi-fw pi-box',
      command: () => navigate('/productos')
    }
  ];

  // Elementos adicionales para administradores
  if (isAuthenticated && user?.rol === 'admin') {
    privateItems.push({
      label: 'Usuarios',
      icon: 'pi pi-fw pi-users',
      command: () => navigate('/usuarios')
    });
  }

  // Elemento de perfil y cerrar sesión
  const endContent = isAuthenticated ? (
    <div className="flex align-items-center gap-2">
      <span className="mr-2">
        <i className="pi pi-user mr-1"></i>
        {user?.nombre || 'Usuario'}
        {user?.rol === 'admin' && <span className="ml-2 p-tag p-tag-success">Admin</span>}
      </span>
      <Button 
        label="Cerrar Sesión" 
        icon="pi pi-sign-out" 
        className="p-button-text p-button-sm" 
        onClick={handleLogout}
      />
    </div>
  ) : null;

  return (
    <div className="card">
      <Menubar 
        model={isAuthenticated ? privateItems : publicItems} 
        end={endContent}
        className="border-noround-top border-noround-bottom"
      />
    </div>
  );
};

export default Navbar;
