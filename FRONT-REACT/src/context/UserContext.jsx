import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';

export const UserContext = createContext();

const BASE_URL = 'http://localhost:3000/usuarios'

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    
    // Opciones de roles disponibles
    const availableRoles = ['usuario', 'admin'];

    const getUsers = async () => {
        setLoading(true);
        try {
            const { data: responseData } = await axios.get(BASE_URL,{
                headers: {
                    Authorization:`Bearer ${ token }`
                }
            });
            console.log("Respuesta usuarios:", responseData);
            setUsers(Array.isArray(responseData.data) ? responseData.data : []);
        } catch (e) {
            console.log(responseData.data)
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };
    
    const addUser = async (newUser) => {
        setLoading(true);
        try {
            const { data: responseData } = await axios.post(BASE_URL, newUser);
            const created = Array.isArray(responseData.data) ? responseData.data[0] : responseData.data || responseData;
            setUsers(prev => Array.isArray(prev) ? [...prev, created] : [created]);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };
    
    const editUser = async (id, updated) => {
        setLoading(true);
        try {
            await axios.put(`${BASE_URL}/${id}`, updated);
            setUsers(prev =>
                prev.map(u => (u.id === id ? { ...updated, id: id } : u))
            );
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };
    
    const deleteUser = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (e) {
            setError(e.message);
        }
    };
    

    useEffect(() => {
        getUsers();
    }, []);

    // Función para actualizar el rol de un usuario
    const updateUserRole = async (userId, newRole) => {
        if (!availableRoles.includes(newRole)) {
            throw new Error('Rol no válido');
        }
        
        setLoading(true);
        try {
            const response = await axios.patch(
                `${BASE_URL}/${userId}/rol`,
                { rol: newRole },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            // Actualizar el estado local
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userId 
                        ? { ...user, rol: newRole }
                        : user
                )
            );
            
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error al actualizar el rol:', error);
            setError(error.response?.data?.message || 'Error al actualizar el rol');
            return { success: false, error: error.response?.data?.message || 'Error al actualizar el rol' };
        } finally {
            setLoading(false);
        }
    };

    const contextValue = {
        users,
        loading,
        error,
        availableRoles: ['usuario', 'admin'],
        getUsers,
        addUser,
        editUser,
        deleteUser,
        updateUserRole
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};