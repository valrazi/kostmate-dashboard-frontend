// src/pages/Account.jsx
import { Card, Input, Button } from "antd";
import Header from "../components/Header";

function Account() {
    const username = "Manto Ariyansyah";

    return (
        <div className="bg-gray-100">
            <Header title="Account" username={username} />

            {/* Card */}
            <div className="mt-4 md:mt-6 flex justify-center">
                <Card className="w-full md:w-2/3 lg:w-1/2 shadow-lg rounded-xl p-2 md:p-4">

                    {/* Header */}
                    <div className="mb-3 md:mb-4">
                        <h2 className="text-base md:text-xl font-semibold">Account</h2>
                    </div>

                    {/* Garis */}
                    <div className="border-t border-gray-200 mb-3 md:mb-4"></div>

                    {/* Form */}
                    <form className="flex flex-col md:flex-row gap-3 md:gap-6">

                        {/* Kiri */}
                        <div className="flex-1 flex flex-col gap-3">
                            <div>
                                <label className="text-xs md:text-sm font-medium">
                                    Nama Lengkap
                                </label>
                                <Input
                                    placeholder="Masukan Nama Lengkap"
                                    size="middle"
                                />
                            </div>

                            <div>
                                <label className="text-xs md:text-sm font-medium">
                                    Email
                                </label>
                                <Input
                                    placeholder="Masukan Email"
                                    size="middle"
                                />
                            </div>
                        </div>

                        {/* Kanan */}
                        <div className="flex-1 flex flex-col gap-3">
                            <div>
                                <label className="text-xs md:text-sm font-medium">
                                    No WhatsApp
                                </label>
                                <Input
                                    placeholder="Masukan No WhatsApp"
                                    size="middle"
                                />
                            </div>

                            <div>
                                <label className="text-xs md:text-sm font-medium">
                                    Password
                                </label>
                                <Input.Password
                                    placeholder="Masukan Password"
                                    size="middle"
                                />
                            </div>
                        </div>

                    </form>

                    {/* Tombol */}
                    <div className="flex flex-col md:flex-row md:justify-end gap-2 mt-6">
                        <Button className="w-full md:w-auto">
                            Batal
                        </Button>
                        <Button type="primary" className="w-full md:w-auto">
                            Simpan
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default Account;