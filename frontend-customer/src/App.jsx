import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Onboarding from './pages/Onboarding';
import OrderSuccess from './pages/OrderSuccess';
import { AuthProvider } from './context/AuthContext';
import DashBoardLayout from './pages/DashBoardLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          
          <Route path="/dashboard" element={<DashBoardLayout />}>
            <Route index element={<Menu />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
