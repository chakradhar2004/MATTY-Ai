import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';
import { setLoading } from './store/slices/uiSlice';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import TemplatesPage from './pages/TemplatesPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import DesignChatPage from './pages/DesignChatPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    
    // Check for existing token and validate
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(setLoading({ key: 'auth', value: true }));
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated, theme]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App min-h-screen bg-app-gradient">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/about"
          element={
            <Layout>
              <AboutPage />
            </Layout>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/templates"
          element={
            <Layout>
              <TemplatesPage />
            </Layout>
          }
        />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <Layout>
                <EditorPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditorPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/design-chat"
          element={
            <ProtectedRoute>
              <Layout>
                <DesignChatPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
