import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useUserContext } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { exportToPDF } from '../../utils/ExportToPdf';
import { PageContainer } from '../../components/layout/PageContainer';
import { PrimaryButton, SuccessButton } from '../../components/buttons/ActionButton';

export default function UsersView() {
  const { user: currentUser } = useAuth();
  const { users, deleteUser, updateUserRole, loading, error, availableRoles = ['usuario', 'admin'], getUsers } = useUserContext();
  const { canEdit, canDelete, isAdmin } = usePermissions();
  const [savingRoles, setSavingRoles] = useState({});
  const [localError, setLocalError] = useState(null);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  const handleExport = () => {
    exportToPDF(users, 'Usuarios', ['nombre', 'email', 'rol', 'edad']);
  };

  const handleDelete = async (id) => {
    if (!canDelete) {
      showError('No tienes permisos para eliminar usuarios');
      return;
    }

    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      const { success, error } = await deleteUser(id);
      if (success) {
        showSuccess('Usuario eliminado correctamente');
        getUsers();
      } else {
        showError(error || 'Error al eliminar el usuario');
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!isAdmin()) {
      showError('No tienes permisos para realizar esta acción');
      return;
    }

    setSavingRoles(prev => ({ ...prev, [userId]: true }));
    
    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        showSuccess(`Rol actualizado correctamente a ${newRole}`);
      } else {
        showError(result.error || 'Error al actualizar el rol');
      }
    } catch (error) {
      showError('Error al actualizar el rol');
      console.error('Error:', error);
    } finally {
      setSavingRoles(prev => ({ ...prev, [userId]: false }));
    }
  };

  const showError = (message) => {
    if (toast.current) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 5000
      });
    }
  };

  const showSuccess = (message) => {
    if (toast.current) {
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: message,
        life: 3000
      });
    }
  };

  const roleEditor = (options) => {
    try {
      const user = options.rowData;
      
      if (!user) return null;
      
      // No permitir editar el rol del usuario actual
      if (user.id === currentUser?.id) {
        return (
          <span className="p-tag">
            {user.rol || 'usuario'}
            {user.rol === 'admin' && <i className="pi pi-star-fill ml-2" style={{ color: 'gold' }}></i>}
          </span>
        );
      }

      return (
        <div className="flex align-items-center gap-2">
          <Dropdown
            value={user.rol || 'usuario'}
            options={availableRoles.map(role => ({
              label: role.charAt(0).toUpperCase() + role.slice(1),
              value: role
            }))}
            onChange={(e) => handleRoleChange(user.id, e.value)}
            disabled={savingRoles[user.id] || currentUser?.rol !== 'admin'}
            className="p-inputtext-sm"
          />
          {savingRoles[user.id] && <i className="pi pi-spin pi-spinner"></i>}
        </div>
      );
    } catch (err) {
      console.error('Error en roleEditor:', err);
      return <span className="text-red-500">Error</span>;
    }
  };

  const header = (
    <div className="flex justify-content-end">
      <PrimaryButton
        label="Exportar PDF"
        icon="pi pi-file-pdf"
        onClick={handleExport}
        disabled={loading || !users?.length}
        tooltip="Exportar a PDF"
        className="mr-2"
      />
      {isAdmin() && (
        <Link to="/usuarios/nuevo">
          <SuccessButton
            label="Nuevo Usuario"
            icon="pi pi-plus"
            tooltip="Crear nuevo usuario"
          />
        </Link>
      )}
    </div>
  );

  return (
    <div className="p-4">
      <Toast ref={toast} position="top-right" />
      <PageContainer title="Gestión de Usuarios" header={header}>
        <div className="card">
          {loading && !users?.length ? (
            <div className="flex justify-content-center p-5">
              <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
            </div>
          ) : error || localError ? (
            <div className="p-error p-3 border-round border-1 border-red-200 bg-red-50">
              <i className="pi pi-exclamation-triangle mr-2"></i>
              {error || localError}
            </div>
          ) : (
            <DataTable 
              value={Array.isArray(users) ? users : []} 
              paginator 
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              className="p-datatable-sm p-datatable-striped"
              emptyMessage="No se encontraron usuarios"
              loading={loading}
            >
              <Column field="nombre" header="Nombre" sortable />
              <Column field="email" header="Email" sortable />
              <Column 
                field="rol" 
                header="Rol" 
                body={roleEditor}
                sortable 
                sortField="rol"
              />
              <Column field="edad" header="Edad" sortable />
              <Column
                field="actions"
                header="Acciones"
                body={(rowData) => (
                  <div className="flex gap-2">
                    <Link to={`/usuarios/editar/${rowData.id}`}>
                      <Button
                        icon="pi pi-pencil"
                        className="p-button-rounded p-button-text p-button-sm"
                        tooltip="Editar"
                        tooltipOptions={{ position: 'top' }}
                        disabled={!isAdmin() || rowData.id === currentUser?.id}
                      />
                    </Link>
                    <Button
                      icon="pi pi-trash"
                      className="p-button-rounded p-button-text p-button-danger p-button-sm"
                      tooltip="Eliminar"
                      tooltipOptions={{ position: 'top' }}
                      onClick={() => handleDelete(rowData.id)}
                      disabled={!isAdmin() || rowData.id === currentUser?.id}
                    />
                  </div>
                )}
                style={{ width: '150px' }}
              />
            </DataTable>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
