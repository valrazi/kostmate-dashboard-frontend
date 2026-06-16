// src/pages/Account.jsx
import { useState, useEffect } from "react";
import { Card, Input, Button, message, Dropdown, Avatar } from "antd";
import { ArrowLeftOutlined, LogoutOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAppStore from "../store/useAppStore";
import api from "../services/api";

function Account() {
    const navigate = useNavigate();
    const user = useAppStore((state) => state.user);
    const setUser = useAppStore((state) => state.setUser);
    const clearUser = useAppStore((state) => state.clearUser);
    const selectedBranch = useAppStore((state) => state.selectedBranch);
    const username = user?.ownerProfile?.name || user?.name || user?.email || "Admin";

    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.ownerProfile) {
            setName(user.ownerProfile.name || "");
            setPhoneNumber(user.ownerProfile.phoneNumber || "");
        }
    }, [user]);

    const handleBack = () => {
        if (selectedBranch) {
            navigate("/");
        } else {
            navigate("/branch");
        }
    };

    const handleLogout = () => {
        clearUser();
        navigate("/login");
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        if (!user?.ownerProfile?.id) {
            message.error("Data profil owner tidak ditemukan");
            return;
        }

        try {
            setLoading(true);
            const res = await api.patch(`/owners/${user.ownerProfile.id}`, {
                name: name,
                phoneNumber: phoneNumber
            });

            // Update user state in Zustand store
            const updatedOwner = res.data.data ? res.data.data : res.data;
            setUser({
                ...user,
                ownerProfile: {
                    ...user.ownerProfile,
                    name: updatedOwner.name,
                    phoneNumber: updatedOwner.phoneNumber
                }
            });

            message.success("Profil berhasil diperbarui");
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.meta?.error?.message 
                || error.response?.data?.message 
                || "Gagal memperbarui profil";
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 relative -mt-6 -mx-6">
            
            {/* PROFILE DROPDOWN TOP RIGHT */}
            <div className="absolute top-4 right-4 z-50">
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "back",
                                icon: <ArrowLeftOutlined style={{ color: '#1B59F8' }} />,
                                label: "Branch",
                                onClick: handleBack,
                            },
                            {
                                type: "divider",
                            },
                            {
                                key: "logout",
                                icon: <LogoutOutlined />,
                                label: "Logout",
                                danger: true,
                                onClick: handleLogout,
                            },
                        ],
                    }}
                    trigger={["click"]}
                >
                    <div className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-full shadow hover:shadow-md transition">
                        <Avatar icon={<UserOutlined />} className="bg-blue-500" style={{ backgroundColor: "#1B59F8" }} />
                        <span className="font-semibold text-gray-700 hidden sm:inline">
                            {username}
                        </span>
                        <DownOutlined className="text-gray-400 text-xs" />
                    </div>
                </Dropdown>
            </div>

            {/* TITLE */}
            <div className="text-center mb-8 mt-12 sm:mt-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    Account Settings
                </h1>
                <p className="text-gray-600 text-lg mb-6">
                    Ubah nama lengkap dan nomor telepon profil Anda
                </p>
            </div>

            {/* Card Content Area */}
            <div className="w-full max-w-2xl px-4">
                <Card className="shadow-lg rounded-xl p-4 md:p-6 bg-white">
                    {/* Form */}
                    <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-3 md:gap-6">

                        {/* Kiri */}
                        <div className="flex-1 flex flex-col gap-3">
                            <div>
                                <label className="text-xs md:text-sm font-medium text-gray-600 block mb-1">
                                    Nama Lengkap
                                </label>
                                <Input
                                    placeholder="Masukan Nama Lengkap"
                                    size="middle"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs md:text-sm font-medium text-gray-600 block mb-1">
                                    Email
                                </label>
                                <Input
                                    placeholder="Masukan Email"
                                    size="middle"
                                    value={user?.email || ""}
                                    disabled
                                    className="!bg-gray-100 !text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Kanan */}
                        <div className="flex-1 flex flex-col gap-3">
                            <div>
                                <label className="text-xs md:text-sm font-medium text-gray-600 block mb-1">
                                    No WhatsApp
                                </label>
                                <Input
                                    placeholder="Masukan No WhatsApp"
                                    size="middle"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs md:text-sm font-medium text-gray-600 block mb-1">
                                    Role
                                </label>
                                <Input
                                    placeholder="Role"
                                    size="middle"
                                    value={user?.role || "OWNER"}
                                    disabled
                                    className="!bg-gray-100 !text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                    </form>

                    {/* Tombol */}
                    <div className="flex flex-col md:flex-row md:justify-end gap-2 mt-6">
                        <Button className="w-full md:w-auto" onClick={handleBack}>
                            Batal
                        </Button>
                        <Button type="primary" className="w-full md:w-auto" loading={loading} onClick={handleSave}>
                            Simpan
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default Account;