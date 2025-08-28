import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

const AccessDenied = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Acceso Denegado';
  }, []);

  return (
    <div className="flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="text-center">
        <i className="pi pi-lock" style={{ fontSize: '5rem', color: 'var(--red-500)' }}></i>
        <h1>Acceso Denegado</h1>
        <p className="text-xl">No tienes los permisos necesarios para acceder a esta página.</p>
        <div className="mt-4">
          <Button 
            label="Volver al Inicio" 
            icon="pi pi-home" 
            onClick={() => navigate('/')}
            className="p-button-rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
