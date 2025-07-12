import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';

// Components
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';
import BusinessLogin from './components/auth/BusinessLogin';
import IndividualLogin from './components/auth/IndividualLogin';
import BusinessSignup from './components/auth/BusinessSignup';
import IndividualSignup from './components/auth/IndividualSignup';

// Business Components
import BusinessDashboard from './components/business/BusinessDashboard';
import BusinessMeasurements from './components/business/BusinessMeasurements';
import BusinessProducts from './components/business/Products';
import BusinessOrders from './components/business/Orders';
import BusinessCart from './components/business/Cart';
import BusinessCheckout from './components/business/Checkout';

// Individual Components
import IndividualDashboard from './components/individual/IndividualDashboard';
import IndividualMeasurements from './components/individual/IndividualMeasurements';
import IndividualProducts from './components/individual/Products';
import IndividualOrders from './components/individual/Orders';
import IndividualCart from './components/individual/Cart';
import IndividualCheckout from './components/individual/Checkout';

// Super Admin Components
import SuperAdminDashboard from './components/superadmin/SuperAdminDashboard';
import ManageUsers from './components/superadmin/ManageUsers';
import ManageProducts from './components/superadmin/ManageProducts';
import ManageOrders from './components/superadmin/ManageOrders';

function App() {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/business/login" element={<BusinessLogin />} />
          <Route path="/individual/login" element={<IndividualLogin />} />
          <Route path="/business/signup" element={<BusinessSignup />} />
          <Route path="/individual/signup" element={<IndividualSignup />} />
          
          {/* Business Routes */}
          <Route path="/business/dashboard" element={
            user?.type === 'business' ? <BusinessDashboard /> : <Navigate to="/business/login" />
          } />
          <Route path="/business/measurements" element={
            user?.type === 'business' ? <BusinessMeasurements /> : <Navigate to="/business/login" />
          } />
          <Route path="/business/products" element={
            user?.type === 'business' ? <BusinessProducts /> : <Navigate to="/business/login" />
          } />
          <Route path="/business/cart" element={
            user?.type === 'business' ? <BusinessCart userType="business" /> : <Navigate to="/business/login" />
          } />
          <Route path="/business/checkout" element={
            user?.type === 'business' ? <BusinessCheckout userType="business" /> : <Navigate to="/business/login" />
          } />
          <Route path="/business/orders" element={
            user?.type === 'business' ? <BusinessOrders /> : <Navigate to="/business/login" />
          } />

          {/* Individual Routes */}
          <Route path="/individual/dashboard" element={
            user?.type === 'individual' ? <IndividualDashboard /> : <Navigate to="/individual/login" />
          } />
          <Route path="/individual/measurements" element={
            user?.type === 'individual' ? <IndividualMeasurements /> : <Navigate to="/individual/login" />
          } />
          <Route path="/individual/products" element={
            user?.type === 'individual' ? <IndividualProducts /> : <Navigate to="/individual/login" />
          } />
          <Route path="/individual/cart" element={
            user?.type === 'individual' ? <IndividualCart userType="individual" /> : <Navigate to="/individual/login" />
          } />
          <Route path="/individual/checkout" element={
            user?.type === 'individual' ? <IndividualCheckout userType="individual" /> : <Navigate to="/individual/login" />
          } />
          <Route path="/individual/orders" element={
            user?.type === 'individual' ? <IndividualOrders /> : <Navigate to="/individual/login" />
          } />

          {/* Super Admin Routes */}
          <Route path="/superadmin/dashboard" element={
            user?.type === 'superadmin' ? <SuperAdminDashboard /> : <Navigate to="/login" />
          } />
          <Route path="/superadmin/users" element={
            user?.type === 'superadmin' ? <ManageUsers /> : <Navigate to="/login" />
          } />
          <Route path="/superadmin/products" element={
            user?.type === 'superadmin' ? <ManageProducts /> : <Navigate to="/login" />
          } />
          <Route path="/superadmin/orders" element={
            user?.type === 'superadmin' ? <ManageOrders /> : <Navigate to="/login" />
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;