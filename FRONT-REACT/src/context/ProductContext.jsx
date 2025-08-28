import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';

export const ProductContext = createContext();

const BASE_URL = 'http://localhost:3000/productos';

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getProducts = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const { data: responseData } = await axios.get(BASE_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Respuesta productos:", responseData);
            setProducts(Array.isArray(responseData.data) ? responseData.data : []);
        } catch (e) {
            console.error("Error fetching products:", e);
            setError(e.response?.data?.message || e.message);
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (newProduct) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const { data: responseData } = await axios.post(BASE_URL, newProduct, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const created = Array.isArray(responseData.data) ? responseData.data[0] : responseData.data || responseData;
            setProducts(prev => Array.isArray(prev) ? [...prev, created] : [created]);
            return { success: true, data: created };
        } catch (e) {
            console.error("Error adding product:", e);
            setError(e.response?.data?.message || e.message);
            return { success: false, error: e.response?.data?.message || e.message };
        } finally {
            setLoading(false);
        }
    };

    const editProduct = async (id, updated) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const { data: responseData } = await axios.put(`${BASE_URL}/${id}`, updated, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const updatedProduct = responseData.data || updated;
            setProducts(prev =>
                prev.map(u => (u.id === id ? { ...updatedProduct, id: id } : u))
            );
            return { success: true, data: updatedProduct };
        } catch (e) {
            console.error("Error updating product:", e);
            setError(e.response?.data?.message || e.message);
            return { success: false, error: e.response?.data?.message || e.message };
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${BASE_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(prev => prev.filter(u => u.id !== id));
            return { success: true };
        } catch (e) {
            console.error("Error deleting product:", e);
            setError(e.response?.data?.message || e.message);
            return { success: false, error: e.response?.data?.message || e.message };
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <ProductContext.Provider
            value={{
                products,
                loading,
                error,
                getProducts,
                addProduct,
                editProduct,
                deleteProduct
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => {
    return useContext(ProductContext);
};
