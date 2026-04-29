import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashBoardLayout from './pages/DasboardLayout';
import Login from './pages/Login';

import Orders from './pages/Orders';

const App = () => {
  return (
    <BrowserRouter>
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App