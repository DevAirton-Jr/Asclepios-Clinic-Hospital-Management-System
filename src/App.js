import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import Agendamentos from './pages/Agendamentos';
import Farmacia from './pages/Farmacia';
import RecursosHumanos from './pages/RecursosHumanos';
import Financeiro from './pages/Financeiro';
import Relatorios from './pages/Relatorios';

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
          <Route path="pacientes" element={<Pacientes />} />
          <Route path="agendamentos" element={<Agendamentos />} />
          <Route path="farmacia" element={<Farmacia />} />
          <Route path="rh" element={<RecursosHumanos />} />
          <Route path="financeiro" element={<Financeiro />} />
          <Route path="relatorios" element={<Relatorios />} />
        </Route>
      </Routes>
    </DataProvider>
  );
}

export default App;