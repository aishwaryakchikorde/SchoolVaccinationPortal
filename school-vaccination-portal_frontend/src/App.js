import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StudentTable from './components/StudentTable';
import BulkUpload from './components/BulkUpload';
import Drive from './components/Drives';
import Reports from './components/ReportTable';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Navbar component (conditionally rendered)
const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  if (!isLoggedIn) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">Dashboard</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/students">Manage Students</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/bulk-upload">Bulk Upload</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reports">Generate Reports</Link>
            </li>
          </ul>
          <div className="d-flex">
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const AppContent = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/students" element={
          <ProtectedRoute>
            <StudentTable />
          </ProtectedRoute>
        } />

        <Route path="/bulk-upload" element={
          <ProtectedRoute>
            <BulkUpload />
          </ProtectedRoute>
        } />

        <Route path="/drives" element={
          <ProtectedRoute>
            <Drive />
          </ProtectedRoute>
        } />

        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />

        {/* Default route: Redirect based on login */}
        <Route path="/" element={
          localStorage.getItem('isLoggedIn') === 'true'
            ? <Navigate to="/dashboard" />
            : <Navigate to="/login" />
        } />

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
