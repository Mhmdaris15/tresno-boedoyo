import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

// Placeholder components for other pages
import { Container, Typography, Paper, Box } from '@mui/material';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <Container maxWidth="md">
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" color="primary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page is under development. Check back soon!
      </Typography>
    </Paper>
  </Container>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
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
              path="/opportunities" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <PlaceholderPage title="Volunteer Opportunities" />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/my-events" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <PlaceholderPage title="My Events" />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/community" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <PlaceholderPage title="Community" />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/achievements" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <PlaceholderPage title="Achievements" />
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
            
            {/* Coordinator Only Routes */}
            <Route 
              path="/manage-events" 
              element={
                <ProtectedRoute requiredRole="COORDINATOR">
                  <Layout>
                    <PlaceholderPage title="Manage Events" />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <PlaceholderPage title="Settings" />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all route */}
            <Route 
              path="*" 
              element={
                <Container>
                  <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography variant="h4" color="error" gutterBottom>
                      404 - Page Not Found
                    </Typography>
                    <Typography variant="body1">
                      The page you're looking for doesn't exist.
                    </Typography>
                  </Box>
                </Container>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
