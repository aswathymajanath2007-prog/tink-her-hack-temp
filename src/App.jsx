import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Receiver from './pages/Receiver';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receiver"
        element={
          <ProtectedRoute>
            <Receiver />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
