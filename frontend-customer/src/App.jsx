import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Onboarding from './pages/Onboarding';
import OrderSuccess from './pages/OrderSuccess';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <OrderSuccess />
      </Router>
    </AuthProvider>
  );
}

export default App;
