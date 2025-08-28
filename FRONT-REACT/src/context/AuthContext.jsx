import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        const userLoged = JSON.parse(localStorage.getItem('user'))
        if(userLoged){
            setUser(userLoged)
            setIsAuthenticated(true)
        }
    }, [])

    const login = async (credentials)=>{
        try {
            const response = await axios.post('http://localhost:3000/auth/login', credentials)
            console.log(response);
            if(response.status === 200){
                const token = response?.data?.token
                const userLogued = response?.data?.user
                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(userLogued))                
                setUser(userLogued)
                setIsAuthenticated(true)
                navigate('/')
            }else{
                alert('Las credenciales son erroneas')
            }
        } catch (error) {
            console.log(error);
            alert("Hubo error al iniciar sesion")
        }
    }

    const register = async (userData) =>{
        try {
            const response = await axios.post('http://localhost:3000/auth/register', userData)
            if(response.status === 201){
                alert("Usuario creado exitosamente")
                navigate('/inicio-sesion')
            }else{
                alert(response.message)
            }
        } catch (error) {
            alert("Hubo un error al registrar el usuario")
        }
    }

    const logout = () =>{
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/inicio-sesion')
    }

    return(
        <AuthContext.Provider value={{
            user, 
            isAuthenticated,
            setUser, 
            register, 
            login, 
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}