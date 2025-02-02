import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Properties from './Pages/Properties';
import TenantInfo from './Pages/TenantInfo';
import RentPayments from './Pages/RentPayments';
import Maintenance from './Pages/Maintenance';
import Reports from './Pages/Reports';
import Logout from './Pages/Logout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/tenantInfo" element={<TenantInfo />} />
        <Route path="/rentPayments" element={<RentPayments />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
};

export default App;