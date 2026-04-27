import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Onboarding from './pages/Onboarding';
import OrderSuccess from './pages/OrderSuccess';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Onboarding />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
