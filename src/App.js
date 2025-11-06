import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Pacientes';
import Appointments from './pages/Agendamentos';
import Pharmacy from './pages/Farmacia';
import HumanResources from './pages/RecursosHumanos';
import Finance from './pages/Financeiro';
import Reports from './pages/Relatorios';

import Layout from './components/Layout';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="pacientes" element={<Patients />} />
          <Route path="agendamentos" element={<Appointments />} />
          <Route path="farmacia" element={<Pharmacy />} />
          <Route path="rh" element={<HumanResources />} />
          <Route path="financeiro" element={<Finance />} />
          <Route path="relatorios" element={<Reports />} />
        </Route>
      </Routes>
    </DataProvider>
  );
}

export default App;