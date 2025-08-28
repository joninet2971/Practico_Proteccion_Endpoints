import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import Home from './layouts/home/index';
import ProductRoutes from './layouts/products/index';
import UserRoutes from './layouts/users/index';
import Navbar from './components/layout/Navbar';

// Context Providers
import { ProductProvider } from './context/ProductContext';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';

// Auth Components
import LoginForm from './layouts/auth/LoginForm';
import RegisterForm from './layouts/auth/RegisterForm';

// Error Pages
import AccessDenied from './layouts/error/AccessDenied';

// Importar los nuevos componentes de ruta
import PrivateRoute from './components/routes/PrivateRoute';
import PublicRoute from './components/routes/PublicRoute';

import './App.css';
import 'primereact/resources/themes/lara-dark-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-column">
          <Navbar />
          <div className="flex-grow-1">
            <Routes>
            <Route element={<PublicRoute restricted={true} />}>
              <Route path="/inicio-sesion" element={<LoginForm />} />
              <Route path="/registro" element={<RegisterForm />} />
            </Route>

            <Route path="/" element={<Home />} />

            <Route element={<PrivateRoute />}>
              <Route 
                path="/productos/*" 
                element={
                  <ProductProvider>
                    <ProductRoutes />
                  </ProductProvider>
                } 
              />
            </Route>

            <Route element={<PrivateRoute roles={['admin']} />}>
              <Route 
                path="/usuarios/*" 
                element={
                  <UserProvider>
                    <UserRoutes />
                  </UserProvider>
                } 
              />
              
            </Route>
            <Route path="/acceso-denegado" element={<AccessDenied />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
