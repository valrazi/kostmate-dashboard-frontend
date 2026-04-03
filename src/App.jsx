import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from "./components/Sidebar";
import Login from './pages/Login';
import useAppStore from './store/useAppStore';
import AddRoom from './pages/AddRoom';
import EditRoom from './pages/EditRoom';
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Branch from './pages/Branch';
import BranchRoom from './pages/BranchRoom';
import EditBranchRoom from './pages/EditBranchRoom';
import AddBranch from './pages/AddBranch';
import AddCust from './pages/AddCust';
import EditCust from './pages/EditCust';
import Payment from './pages/Payment';
import EditPayment from './pages/EditPayment';
import Account from './pages/Account';
import IsiRoom from './pages/IsiRoom';
import UploadPayment from './pages/UploadPayment'

const { Content } = Layout;

// Protected Route wrapper to check authentication
const ProtectedRoute = ({ element, pathname }) => {
  const user = useAppStore((state) => state.user);
  
  // If user is not logged in and trying to access non-login page, redirect to login
  if (!user && pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }
  
  // If user is logged in and trying to access login page, redirect to branch
  if (user && pathname === '/login') {
    return <Navigate to="/branch" replace />;
  }
  
  return element;
};

function App() {
  const AppContent = () => {
    const location = useLocation();
    const showSidebar = location.pathname !== '/branch' && location.pathname !== '/login';

    return (
      <Layout className="h-screen overflow-hidden">
        {showSidebar && <Sidebar />}

        <Layout className="overflow-y-auto">
          <Content className="p-6 bg-gray-100 min-h-max">
            <Routes>
              <Route path="/login" element={<ProtectedRoute element={<Login />} pathname="/login" />} />
              <Route path="/" element={<ProtectedRoute element={<Dashboard />} pathname="/" />} />
              <Route path="/branch" element={<ProtectedRoute element={<Branch />} pathname="/branch" />} />
              <Route path="/branch/room" element={<ProtectedRoute element={<BranchRoom />} pathname="/branch/room" />} />
              <Route path="/branch/room/edit" element={<ProtectedRoute element={<EditBranchRoom />} pathname="/branch/room/edit" />} />
              <Route path="/users" element={<ProtectedRoute element={<Users />} pathname="/users" />} />
              <Route path="/branch/add" element={<ProtectedRoute element={<AddBranch />} pathname="/branch/add" />} />
              <Route path="/cust/add" element={<ProtectedRoute element={<AddCust />} pathname="/cust/add" />} />
              <Route path="/cust/edit" element={<ProtectedRoute element={<EditCust />} pathname="/cust/edit" />} />
              <Route path="/payment" element={<ProtectedRoute element={<Payment />} pathname="/payment" />} />
              <Route path="/payment/edit" element={<ProtectedRoute element={<EditPayment />} pathname="/payment/edit" />} />
              <Route path="/account" element={<ProtectedRoute element={<Account />} pathname="/account" />} />
              <Route path="/room/add" element={<ProtectedRoute element={<AddRoom />} pathname="/room/add" />} />
              <Route path="/room/edit" element={<ProtectedRoute element={<EditRoom />} pathname="/room/edit" />} />
              <Route path="/room/isi" element={<ProtectedRoute element={<IsiRoom />} pathname="/room/isi" />} />
              <Route path="/payment/upload" element={<ProtectedRoute element={<UploadPayment />} pathname="/payment/upload" />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    );
  };

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;