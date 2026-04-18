import { Button, message, Spin } from "antd";
import {
  PlusOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAppStore from "../store/useAppStore";
import api from "../services/api";

// MODAL
import AddBranchModal from "../components/AddBranchModal";
import EditBranchModal from "../components/EditBranchModal";

function Branch() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const setSelectedBranchStore = useAppStore((state) => state.setSelectedBranch);
  const clearUser = useAppStore((state) => state.clearUser);

  // STATE MODAL
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  // STATE API
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  const handleLogout = () => {
    // Memanggil API logout jika ada (optional)
    // api.post('/auth/logout').catch(console.error);
    clearUser();
    navigate("/login");
  };

  // Constants untuk UI
  const colors = [
    "from-red-500 to-red-700",
    "from-blue-500 to-blue-700",
    "from-purple-500 to-purple-700",
    "from-green-500 to-green-700",
    "from-yellow-500 to-yellow-700"
  ];

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true);
      const ownerId = user?.ownerProfile?.id;
      const response = await api.get(`/branches${ownerId ? `?owner_id=${ownerId}` : ''}`);
      setBranches(response.data || []);
    } catch (error) {
      console.error("Fetch branches error:", error);
      message.error("Gagal memuat data cabang");
    } finally {
      setLoadingBranches(false);
    }
  };

  const maxBranchQuota = user?.ownerProfile?.branchQuota || 0;
  const totalRoomQuota = user?.ownerProfile?.roomQuota || 0;
  const usedRoomQuota = branches.reduce((sum, b) => sum + (b.roomQuota || 0), 0);
  const canAddBranch = branches.length < maxBranchQuota;

  const handleSelectBranch = (branch) => {
    setSelectedBranchStore(branch);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">

      {/* TITLE */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Pilih Cabang Kost
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Silakan pilih cabang yang ingin Anda kelola
        </p>

        {/* STATS BADGE */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold border border-blue-200 shadow-sm">
            Cabang: {branches.length} / {maxBranchQuota}
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold border border-green-200 shadow-sm">
            Kuota Kamar: {usedRoomQuota} / {totalRoomQuota}
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">

          {loadingBranches ? (
            <div className="col-span-full py-10 flex justify-center">
              <Spin size="large" />
            </div>
          ) : branches.map((branch, index) => {
            const color = colors[index % colors.length];
            const total = branch.roomQuota || 0;
            const occupied = branch.customers ? branch.customers.length : 0; // Simple approximation

            return (
              <div
                key={branch.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
              >

                {/* HEADER */}
                <div className={`bg-gradient-to-r ${color} text-white text-center py-2 font-semibold`}>
                  {branch.name}
                </div>

                <div className="border-b border-gray-200" />

                {/* ISI */}
                <div
                  className="flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelectBranch(branch)}
                >
                  <div className="text-2xl md:text-3xl font-bold text-gray-800">
                    {occupied}
                  </div>
                  <div className="text-sm text-gray-500">
                    / {total}
                  </div>
                </div>

                {/* EDIT BUTTON */}
                <div className="px-3 pb-3">
                  <Button
                    size="small"
                    block
                    icon={<EditOutlined />}
                    className="!border-blue-500 !text-blue-500 hover:!bg-blue-500 hover:!text-white"
                    onClick={() => {
                      setSelectedBranch(branch); // kirim data (internal state modal)
                      setOpenEdit(true);          // buka modal
                    }}
                  >
                    Edit
                  </Button>
                </div>

              </div>
            );
          })}

          {/* ADD BRANCH */}
          {canAddBranch && (
            <div
              className="bg-white rounded-xl shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-all border-2 border-dashed border-gray-300 min-h-[160px]"
              onClick={() => setOpenAdd(true)}
            >
              <div className="py-6 flex flex-col items-center">
                <PlusOutlined className="text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500 font-semibold">Add Branch</p>
              </div>
            </div>
          )}

        </div>

        {/* LOGOUT */}
        <div className="flex justify-center">
          <Button
            type="primary"
            danger
            size="large"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* ================= MODAL ================= */}

      {/* ADD */}
      <AddBranchModal
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onSuccess={() => {
          setOpenAdd(false);
          fetchBranches();
        }}
      />

      {/* EDIT */}
      <EditBranchModal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        data={selectedBranch} // kirim data ke modal
        onSuccess={() => {
          setOpenEdit(false);
          fetchBranches();
        }}
      />

    </div>
  );
}

export default Branch;