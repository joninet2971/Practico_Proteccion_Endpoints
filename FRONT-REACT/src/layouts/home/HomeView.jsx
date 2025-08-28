import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { AuthContext } from '../../context/AuthContext';

const HomeView = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <div className="p-4">
      <Card className="shadow-1">
        <div className="text-center mb-5">
          <h1 className="text-4xl font-bold mb-3">Bienvenido al CRUD de productos y usuarios</h1>
          <p className="text-gray-600 mb-6">
            Aplicación fullstack en JavaScript donde el frontend (React) consume los datos expuestos por el backend (Express),
            permitiendo realizar operaciones CRUD completas.
          </p>
          
          {user ? (
            <div className="flex flex-column md:flex-row justify-content-center gap-3">
              <Link to="/usuarios">
                <Button 
                  label="Usuarios" 
                  icon="pi pi-users" 
                  className="p-button-outlined"
                />
              </Link>
              <Link to="/productos">
                <Button 
                  label="Productos" 
                  icon="pi pi-shopping-cart" 
                  className="p-button-outlined"
                />
              </Link>
              <Button 
                label="Cerrar Sesión" 
                icon="pi pi-sign-out" 
                onClick={logout}
                className="p-button-text p-button-sm"
              />
            </div>
          ) : (
            <div className="flex flex-column md:flex-row justify-content-center gap-3">
              <Link to="/inicio-sesion">
                <Button 
                  label="Iniciar sesión" 
                  icon="pi pi-sign-in" 
                  className="p-button-outlined"
                />
              </Link>
              <Link to="/registro">
                <Button 
                  label="Registrarse" 
                  icon="pi pi-user-plus" 
                  className="p-button-outlined"
                />
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HomeView;
