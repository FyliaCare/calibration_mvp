import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { NewCalibrationPage } from '@/pages/NewCalibrationPage';
import NewJobPage from '@/pages/NewJobPage';
import WorksheetPage from '@/pages/WorksheetPage';
import EquipmentListPage from '@/pages/EquipmentListPage';
import EquipmentDetailPage from '@/pages/EquipmentDetailPage';
import ClientListPage from '@/pages/ClientListPage';
import ClientDetailPage from '@/pages/ClientDetailPage';
import CalibrationListPage from '@/pages/CalibrationListPage';
import CalibrationDetailPage from '@/pages/CalibrationDetailPage';
import ReportsPage from '@/pages/ReportsPage';
import UsersListPage from '@/pages/UsersListPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
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
            <Route path="jobs/new" element={<NewJobPage />} />
            <Route path="calibrations/new" element={<NewCalibrationPage />} />
            <Route path="worksheets/new" element={<WorksheetPage />} />
            <Route path="equipment" element={<EquipmentListPage />} />
            <Route path="equipment/:id" element={<EquipmentDetailPage />} />
            <Route path="equipment/:id/edit" element={<div className="text-center py-12">Equipment edit page coming soon...</div>} />
            <Route path="equipment/new" element={<div className="text-center py-12">Add equipment page coming soon...</div>} />
            <Route path="clients" element={<ClientListPage />} />
            <Route path="clients/:id" element={<ClientDetailPage />} />
            <Route path="clients/:id/edit" element={<div className="text-center py-12">Edit client page coming soon...</div>} />
            <Route path="clients/new" element={<div className="text-center py-12">Add client page coming soon...</div>} />
            <Route path="calibrations" element={<CalibrationListPage />} />
            <Route path="calibrations/:id" element={<CalibrationDetailPage />} />
            <Route path="calibrations/:id/edit" element={<div className="text-center py-12">Edit calibration page coming soon...</div>} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="users" element={<UsersListPage />} />
            <Route path="users/:userId" element={<ProfilePage />} />
            <Route path="users/:userId/edit" element={<div className="text-center py-12">Edit user page coming soon...</div>} />
            <Route path="users/new" element={<div className="text-center py-12">Create user page coming soon...</div>} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
