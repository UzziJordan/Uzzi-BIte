import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Meals from "./pages/Meals.jsx";
import Orders from "./pages/Orders.jsx";
import Tables from "./pages/Tables.jsx";
import Settings from "./pages/Settings.jsx";
import Stats from "./pages/Stats.jsx";
import DashBoardLayout from "./pages/DashBoardLayout.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px'
          }
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashBoardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Stats />} />
            <Route path="meals" element={<Meals />} />
            <Route path="orders" element={<Orders />} />
            <Route path="tables" element={<Tables />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;