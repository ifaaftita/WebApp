import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext'; 
import './App.css';
// Public components
import Accueil from './accueil/accueil';
import Signin from './auth/signin'; 
import Signup from './auth/signup';

// Dashboard components
import Admindash from './admin/admindash';
import Opticiendash from './opticien/opticiendash';

// Opticien sections
import Client from './opticien/sections/ClientsSection';
import Prescriptions from './opticien/sections/prescriptions';
import Appointments from './opticien/sections/appointments';
import Products from './opticien/sections/products';
import Orders from './opticien/sections/orders';
import Purchases from './opticien/sections/purchases';
import Sales from './opticien/sections/sales';
import Invoices from './opticien/sections/invoices';
import Brand from './opticien/sections/brand';
import Shop from './opticien/sections/shop';
import Suppliers from './opticien/sections/suppliers';
import Delivery from './opticien/sections/delivery';
import Profile from './opticien/sections/profile';

const PrivateRoute = ({ requiredRole, children }) => {
  const { user } = React.useContext(AuthContext);
  
  if (!user) return <Navigate to="/signin" replace />;
  if (user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/opticien'} replace />;
  }

  return children;
};
const OpticienLayout = () => (
  <>
    <Opticiendash />
    <div className="content-container">
      <Outlet />
    </div>
  </>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Accueil />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />

            {/* Admin routes */}
          <Route path="/admin" element={
            <PrivateRoute requiredRole="admin">
              <Admindash />
            </PrivateRoute>
          } />

            {/* Opticien routes */}
          <Route path="/opticien" element={
            <PrivateRoute requiredRole="opticien">
              <Opticiendash />
            </PrivateRoute>
          }>
            <Route index element={<div></div>} />
            <Route path="client" element={<Client />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="sales" element={<Sales />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="brand" element={<Brand />} />
            <Route path="shop" element={<Shop />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="delivery" element={<Delivery />} />
            <Route path="profile" element={<Profile />} />
          </Route>

           {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};
export default App;