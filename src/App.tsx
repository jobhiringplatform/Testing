import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import MyTickets from './pages/MyTickets';
import NewTicket from './pages/NewTicket';
import TicketTracking from './pages/TicketTracking';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import Employee from './pages/Employee';
import EmployeeManagement from './pages/EmployeeManagement';
import ReviewsManagement from './pages/ReviewsManagement';
import AIAssistant from './components/AIAssistant';
import BackgroundEffects from './components/BackgroundEffects';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <BackgroundEffects />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          } />
          
          <Route path="/auth" element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/my-tickets" element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          } />
          
          <Route path="/new-ticket" element={
            <ProtectedRoute>
              <NewTicket />
            </ProtectedRoute>
          } />
          
          <Route path="/track-ticket" element={
            <ProtectedRoute>
              <TicketTracking />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/employees" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EmployeeManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/reviews" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ReviewsManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/employee" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <Employee />
            </ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>
      
      {user && <AIAssistant />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;