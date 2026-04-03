import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from "./components/Sidebar";
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

function App() {
  return (
    <BrowserRouter>
      <Layout className="h-screen overflow-hidden">
        <Sidebar />

        <Layout className="overflow-y-auto">
          <Content className="p-6 bg-gray-100 min-h-max">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/branch" element={<Branch />} />
              <Route path="/branch/room" element={<BranchRoom />} />
              <Route path="/branch/room/edit" element={<EditBranchRoom />} />
              <Route path="/users" element={<Users />} />
              <Route path="/branch/add" element={<AddBranch />} />
              <Route path="/cust/add" element={<AddCust />} />
              <Route path="/cust/edit" element={<EditCust />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment/edit" element={<EditPayment />} />
              <Route path="/account" element={<Account />} />
              <Route path="/room/add" element={<AddRoom />} />
              <Route path="/room/edit" element={<EditRoom />} />
              <Route path="/room/isi" element={<IsiRoom />} />
              <Route path="/payment/upload" element={<UploadPayment />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;