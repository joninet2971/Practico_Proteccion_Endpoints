import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useProductContext } from '../../context/ProductContext';
import { usePermissions } from '../../hooks/usePermissions';
import { exportToPDF } from '../../utils/ExportToPdf';
import { PageContainer } from '../../components/layout/PageContainer';
import { PrimaryButton, SuccessButton } from '../../components/buttons/ActionButton';

export default function ProductsView() {
  const { products, deleteProduct, loading, error, getProducts } = useProductContext();
  const { canCreate, isAdmin } = usePermissions();
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const showError = (message) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });
  };

  const showSuccess = (message) => {
    toast.current?.show({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
      life: 3000
    });
  };

  const handleDelete = async (id) => {
    if (!canDelete()) {
      showError('No tienes permisos para eliminar productos');
      return;
    }

    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      const { success, error } = await deleteProduct(id);
      if (success) {
        showSuccess('Producto eliminado correctamente');
        getProducts(); // Refresh the list
      } else {
        showError(error || 'Error al eliminar el producto');
      }
    }
  };

  const handleExport = () => {
    exportToPDF(products, 'Productos', ['nombre', 'precio']);
  };

  const header = (
    <div className="flex justify-content-end">
      <PrimaryButton
        label="Exportar PDF"
        icon="pi pi-file-pdf"
        onClick={handleExport}
        disabled={loading || !products?.length}
        tooltip="Exportar a PDF"
        className="mr-2"
      />
      {canCreate && (
        <Link to="/productos/nuevo">
          <SuccessButton
            label="Nuevo Producto"
            icon="pi pi-plus"
            tooltip="Crear nuevo producto"
          />
        </Link>
      )}
    </div>
  );

  return (
    <div className="p-4">
      <Toast ref={toast} position="top-right" />
      <PageContainer title="Productos" header={header}>
        <div className="card">
          <DataTable
            value={products || []}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
            emptyMessage="No se encontraron productos"
            stripedRows
            size="small"
            className="p-datatable-sm"
            loading={loading}
          >
              <Column field="id" header="ID" sortable style={{ width: '10%' }} />
              <Column field="nombre" header="Nombre" sortable style={{ width: '25%' }} />
              <Column 
                field="precio" 
                header="Precio" 
                sortable 
                body={(rowData) => `$${rowData.precio?.toLocaleString('es-AR')}`}
                style={{ width: '15%' }}
              />
              <Column
                field="actions"
                header="Acciones"
                body={(rowData) => (
                  <div className="flex gap-2">
                    <Link to={`/productos/editar/${rowData.id}`}>
                      <Button
                        icon="pi pi-pencil"
                        className="p-button-rounded p-button-text p-button-sm"
                        tooltip="Editar"
                        tooltipOptions={{ position: 'top' }}
                      />
                    </Link>
                    <Button
                      icon="pi pi-trash"
                      className="p-button-rounded p-button-text p-button-danger p-button-sm"
                      tooltip="Eliminar"
                      tooltipOptions={{ position: 'top' }}
                      onClick={() => handleDelete(rowData.id)}
                    />
                  </div>
                )}
                style={{ width: '120px' }}
              />
            </DataTable>
          </div>
        </PageContainer>
      </div>
    );
  }
