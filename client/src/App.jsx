import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import BloodBankDashboard from './pages/BloodBankDashboard';
import BloodSearch from './pages/BloodSearch';
import BloodRequest from './pages/BloodRequest';
import BloodRequestManagement from './pages/BloodRequestManagement';
import DonationRecords from './pages/DonationRecords';
import DonorDashboard from './pages/DonorDashboard';
import DonorProfile from './pages/DonorProfile';
import DonationHistory from './pages/DonationHistory';
import HospitalDashboard from './pages/HospitalDashboard';
import InventoryManagement from './pages/InventoryManagement';
import RequestTracking from './pages/RequestTracking';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blood-search" element={<BloodSearch />} />
            <Route path="/blood-request" element={<ProtectedRoute><BloodRequest /></ProtectedRoute>} />
            <Route path="/blood-request-management" element={<ProtectedRoute allowedRoles={['BLOODBANK']}><BloodRequestManagement /></ProtectedRoute>} />
            <Route path="/donation-records" element={<ProtectedRoute allowedRoles={['BLOODBANK']}><DonationRecords /></ProtectedRoute>} />
            {/* Protected routes */}
            <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/blood-bank-dashboard" element={<ProtectedRoute allowedRoles={['BLOODBANK']}><BloodBankDashboard /></ProtectedRoute>} />
            <Route path="/donor-dashboard" element={<ProtectedRoute><DonorDashboard /></ProtectedRoute>} />
            <Route path="/donor-profile" element={<ProtectedRoute><DonorProfile /></ProtectedRoute>} />
            <Route path="/donation-history" element={<ProtectedRoute><DonationHistory /></ProtectedRoute>} />
            <Route path="/hospital-dashboard" element={<ProtectedRoute><HospitalDashboard /></ProtectedRoute>} />
            <Route path="/inventory-management" element={<ProtectedRoute><InventoryManagement /></ProtectedRoute>} />
            <Route path="/request-tracking" element={<ProtectedRoute><RequestTracking /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;