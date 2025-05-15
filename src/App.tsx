import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import DuplicatesPage from './pages/DuplicatesPage';
import MergePage from './pages/MergePage';
import HistoryPage from './pages/HistoryPage';
import AuthPage from './pages/AuthPage';
import OAuthCallback from './pages/OAuthCallback';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/gohighlevel-bulk-contact-deduper-free" element={<HomePage />} />
              <Route path="/merge-duplicate-contacts-gohighlevel-tool" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/oauth/callback" element={<OAuthCallback />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/duplicates" element={<DuplicatesPage />} />
                <Route path="/merge" element={<MergePage />} />
                <Route path="/history" element={<HistoryPage />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;