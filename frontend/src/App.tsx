import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { NewCalibrationPage } from '@/pages/NewCalibrationPage';
import WorksheetPage from '@/pages/WorksheetPage';
import { useAuthStore } from '@/stores/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="calibrations/new" element={<NewCalibrationPage />} />
            <Route path="worksheets/new" element={<WorksheetPage />} />
            <Route path="equipment" element={<div className="text-center py-12">Equipment page coming soon...</div>} />
            <Route path="clients" element={<div className="text-center py-12">Clients page coming soon...</div>} />
            <Route path="calibrations" element={<div className="text-center py-12">Calibrations page coming soon...</div>} />
            <Route path="reports" element={<div className="text-center py-12">Reports page coming soon...</div>} />
            <Route path="users" element={<div className="text-center py-12">Users page coming soon...</div>} />
            <Route path="settings" element={<div className="text-center py-12">Settings page coming soon...</div>} />
          </Route>
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
