import { Button } from "antd";
import { PlusOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAppStore from "../store/useAppStore";

function Branch() {
  const navigate = useNavigate();
  const clearUser = useAppStore((state) => state.clearUser);

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  const profiles = [
    {
      id: 1,
      name: "Kost Anugrah",
      occupied: 27,
      total: 80,
      color: "from-red-500 to-red-700",
    },
    {
      id: 2,
      name: "Kost Mega",
      occupied: 45,
      total: 60,
      color: "from-blue-500 to-blue-700",
    },
    {
      id: 3,
      name: "Kost Jaya",
      occupied: 32,
      total: 50,
      color: "from-purple-500 to-purple-700",
    },
    {
      id: 4,
      name: "Kost Elite",
      occupied: 18,
      total: 40,
      color: "from-green-500 to-green-700",
    },
    {
      id: 5,
      name: "Kost Premier",
      occupied: 55,
      total: 70,
      color: "from-yellow-500 to-yellow-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* TITLE */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Select Your Branch
        </h1>
        <p className="text-gray-600 text-lg">Choose a location to manage</p>
      </div>

      {/* PROFILE GRID */}
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="group cursor-pointer flex flex-col items-center"
              onClick={() => navigate("/branch/room")}
            >
              {/* Profile Card */}
              <div
                className={`relative mb-3 w-24 h-24 md:w-32 md:h-32 rounded-lg shadow-xl overflow-hidden transform transition-transform group-hover:scale-110 group-hover:shadow-2xl bg-gray-300`}
              >
                {/* Filled Progress Section */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${profile.color} transition-all`}
                  style={{
                    height: `${(profile.occupied / profile.total) * 100}%`,
                  }}
                />

                {/* Empty Section */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gray-200"
                  style={{
                    height: `${((profile.total - profile.occupied) / profile.total) * 100}%`,
                  }}
                />

                {/* Profile Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg">
                    {profile.occupied}
                  </div>
                  <div className="text-white text-xs md:text-sm opacity-90 drop-shadow-lg">
                    /{profile.total}
                  </div>
                </div>

                
              </div>

              {/* Profile Name */}
              <p className="text-gray-900 text-sm md:text-base font-semibold text-center group-hover:text-gray-700 transition-colors">
                {profile.name}
              </p>
            </div>
          ))}

          {/* ADD NEW PROFILE */}
          <div
            className="group cursor-pointer flex flex-col items-center"
            onClick={() => navigate("/branch/add")}
          >
            <div className="relative mb-3 w-24 h-24 md:w-32 md:h-32 rounded-lg bg-gray-300 shadow-xl overflow-hidden transform transition-transform group-hover:scale-110 group-hover:shadow-2xl flex items-center justify-center border-2 border-dashed border-gray-500 group-hover:border-gray-400">
              <PlusOutlined className="text-3xl md:text-4xl text-gray-500 group-hover:text-gray-300 transition-colors" />
            </div>
            <p className="text-gray-700 text-sm md:text-base font-semibold text-center group-hover:text-gray-900 transition-colors">
              Add Branch
            </p>
          </div>
        </div>
        {/* LOGOUT BUTTON */}
        <div className="w-full flex justify-center items-center">
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
    </div>
  );
}

export default Branch;
