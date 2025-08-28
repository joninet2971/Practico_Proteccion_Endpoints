import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useProductContext } from "../../context/ProductContext"; 
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Card } from "primereact/card";
import { useAuth } from "../../context/AuthContext";
import { ProgressSpinner } from 'primereact/progressspinner';

const validationSchema = Yup.object({
  nombre: Yup.string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .required("El nombre es requerido"),

  precio: Yup.number()
    .typeError("El precio debe ser un número")
    .positive("El precio debe ser mayor que 0")
    .max(1000000, "El precio no puede ser mayor a 1,000,000")
    .required("El precio es requerido"),

  descripcion: Yup.string()
    .trim()
    .max(500, "La descripción no puede tener más de 500 caracteres"),

  stock: Yup.number()
    .typeError("El stock debe ser un número")
    .integer("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo")
    .required("El stock es requerido"),
});


export default function ProductForm() {
  const { addProduct, editProduct, loading } = useProductContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [initialValues, setInitialValues] = useState({
    nombre: "",
    precio: 0,
    descripcion: "",
    stock: 0,
  });

  const isEdit = Boolean(id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const loadProduct = async () => {
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }
        
        const apiUrl = 'http://localhost:3000';
        const response = await axios.get(`${apiUrl}/productos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.data) {
          const productData = response.data.data;
          setInitialValues({
            nombre: productData.nombre || '',
            precio: productData.precio || 0,
            descripcion: productData.descripcion || '',
            stock: productData.stock || 0,
          });
        }
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        alert('Error al cargar el producto. Por favor, intente nuevamente.');
        navigate('/productos');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.rol !== 'admin') {
      alert('No tienes permisos para acceder a esta página');
      navigate('/productos');
    } else if (isEdit) {
      loadProduct();
    } else {
      setIsLoading(false);
    }
  }, [user, navigate, isEdit, id]);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    console.log('Iniciando envío del formulario con valores:', values);
    if (isSubmitting) {
      console.log('Ya se está enviando el formulario, ignorando nuevo envío');
      return;
    }
    
    setSubmitting(true);
    setIsSubmitting(true);
    console.log('Token actual:', localStorage.getItem('token'));
    
    try {
      const productData = {
        ...values,
        id: isEdit ? Number(id) : undefined,
        precio: Number(values.precio),
        stock: Number(values.stock)
      };
      
      console.log('Enviando datos del producto:', productData);
      
      let result;
      if (isEdit) {
        console.log('Editando producto existente con ID:', id);
        result = await editProduct(Number(id), productData);
        console.log('Respuesta de la API al editar:', result);
      } else {
        console.log('Creando nuevo producto');
        result = await addProduct(productData);
      }
      
      if (result && result.success) {
        const mensaje = isEdit ? 'Producto actualizado correctamente' : 'Producto creado correctamente';
        console.log(mensaje);
        alert(mensaje);
        navigate('/productos');
      } else {
        const errorMsg = result?.error || 'Error desconocido al guardar el producto';
        console.error('Error al guardar:', errorMsg);
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      alert(`Error al guardar el producto: ${error.message}`);
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  // Load product data when in edit mode
  useEffect(() => {
    const loadProduct = async () => {
      if (isEdit && id) {
        try {
          console.log('Loading product with ID:', id);
          const token = localStorage.getItem('token');
          console.log('Using token:', token ? 'Token exists' : 'No token found');
          
          const apiUrl = 'http://localhost:3000';
          const response = await axios.get(`${apiUrl}/productos/${id}`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log('Product API Response:', response);
          
          if (response.data) {
            const productData = {
              nombre: response.data.data.nombre || '',
              precio: response.data.data.precio || 0,
              descripcion: response.data.data.descripcion || '',
              stock: response.data.data.stock || 0
            };
            console.log('Setting initial values:', productData);
            setInitialValues(productData);
          }
        } catch (error) {
          console.error('Error loading product:', error);
          console.error('Error response:', error.response);
          alert(`Error al cargar el producto: ${error.response?.data?.message || error.message}`);
          navigate('/productos');
        }
      }
    };
    
    loadProduct();
  }, [id, isEdit, navigate]);

  if (loading || isLoading) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="p-fluid">
      <div className="flex justify-content-center">
        <Card 
          title={`${isEdit ? 'Editar' : 'Crear'} Producto`} 
          className="w-full md:w-6 lg:w-5 xl:w-4"
        >
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, values, setFieldValue }) => (
              <Form className="p-fluid">
                <div className="flex flex-column" style={{ gap: '1rem' }}>
                  <div className="field mb-4">
                    <label htmlFor="nombre" className="font-bold block mb-2">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon">
                        <i className="pi pi-tag"></i>
                      </span>
                      <Field
                        id="nombre"
                        name="nombre"
                        as={InputText}
                        className={`w-full ${errors.nombre && touched.nombre ? 'p-invalid' : ''}`}
                        placeholder="Ej: Camiseta de algodón"
                        disabled={isSubmitting}
                        autoFocus
                      />
                    </div>
                    <ErrorMessage
                      name="nombre"
                      component="small"
                      className="p-error block"
                    />
                  </div>

                  <div className="grid">
                    <div className="col-12 md:col-6">
                      <div className="field mb-4">
                        <label htmlFor="precio" className="font-bold block mb-2">
                          Precio <span className="text-red-500">*</span>
                        </label>
                        <div className="p-inputgroup">
                          <span className="p-inputgroup-addon">
                            <i className="pi pi-dollar"></i>
                          </span>
                          <InputNumber
                            id="precio"
                            name="precio"
                            value={values.precio}
                            onValueChange={(e) => setFieldValue('precio', e.value)}
                            mode="currency"
                            currency="ARS"
                            locale="es-AR"
                            className="w-full"
                            min={0}
                            max={1000000}
                            disabled={isSubmitting}
                          />
                        </div>
                        <ErrorMessage
                          name="precio"
                          component="small"
                          className="p-error block"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-content-between mt-4">
                    <Button 
                      type="button"
                      label="Cancelar"
                      icon="pi pi-arrow-left"
                      className="p-button-text"
                      onClick={() => navigate('/productos')}
                      disabled={isSubmitting}
                    />
                    <Button 
                      type="submit"
                      label={isEdit ? 'Actualizar' : 'Guardar'}
                      icon={isEdit ? 'pi pi-check' : 'pi pi-save'}
                      className="p-button-success"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
}
