import { Button } from "antd";
import {
  PlusOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useAppStore from "../store/useAppStore";

// MODAL
import AddBranchModal from "../components/AddBranchModal";
import EditBranchModal from "../components/EditBranchModal";

function Branch() {
  const navigate = useNavigate();
  const clearUser = useAppStore((state) => state.clearUser);

  // STATE MODAL
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  const profiles = [
    { id: 1, name: "Kost Anugrah", occupied: 45, total: 60, color: "from-red-500 to-red-700" },
    { id: 2, name: "Kost Mega", occupied: 45, total: 60, color: "from-blue-500 to-blue-700" },
    { id: 3, name: "Kost Jaya", occupied: 32, total: 50, color: "from-purple-500 to-purple-700" },
    { id: 4, name: "Kost Elite", occupied: 18, total: 40, color: "from-green-500 to-green-700" },
    { id: 5, name: "Kost Premier", occupied: 55, total: 70, color: "from-yellow-500 to-yellow-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">

      {/* TITLE */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Select Your Branch
        </h1>
        <p className="text-gray-600 text-lg">
          Choose a location to manage
        </p>
      </div>

      {/* GRID */}
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">

          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
            >
              
              {/* HEADER */}
              <div className={`bg-gradient-to-r ${profile.color} text-white text-center py-2 font-semibold`}>
                {profile.name}
              </div>

              <div className="border-b border-gray-200" />

              {/* ISI */}
              <div
                className="flex flex-col items-center justify-center py-6 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="text-2xl md:text-3xl font-bold text-gray-800">
                  {profile.occupied}
                </div>
                <div className="text-sm text-gray-500">
                  / {profile.total}
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
                    setSelectedBranch(profile); // kirim data
                    setOpenEdit(true);          // buka modal
                  }}
                >
                  Edit
                </Button>
              </div>

            </div>
          ))}

          {/* ADD BRANCH */}
          <div
            className="bg-white rounded-xl shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-all border-2 border-dashed border-gray-300"
            onClick={() => setOpenAdd(true)}
          >
            <div className="py-6 flex flex-col items-center">
              <PlusOutlined className="text-3xl text-gray-400 mb-2" />
              <p className="text-gray-500 font-semibold">Add Branch</p>
            </div>
          </div>

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
      />

      {/* EDIT */}
      <EditBranchModal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        data={selectedBranch} // kirim data ke modal
      />

    </div>
  );
}

export default Branch;