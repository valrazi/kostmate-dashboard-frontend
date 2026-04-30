import { Button, Input, Select, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import Header from "../components/Header";
import useAppStore from "../store/useAppStore";
import api from "../services/api";

function AddRoom() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const selectedBranch = useAppStore((state) => state.selectedBranch);
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  if (!selectedBranch) {
    navigate("/branch");
    return null;
  }

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        branchId: selectedBranch.id,
      };

      await api.post("/rooms", payload);
      message.success("Room berhasil ditambahkan");
      navigate("/branch/room");
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.meta?.error?.message 
        || error.response?.data?.message 
        || "Gagal menambah room";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <Header title="Room" username={user?.ownerProfile?.name || user?.email} />

      <div className="flex-1 flex justify-center items-start mt-6 md:mt-8 px-3 md:px-4">
        <div className="w-full md:w-2/5 bg-white shadow-lg rounded-xl p-4 md:p-6 mb-10">
          
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
            <h2 className="text-md md:text-lg font-semibold">
              Tambah Room
            </h2>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => navigate(-1)}
            />
          </div>

          <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleSubmit}
            className="flex flex-col gap-2"
          >
            <Form.Item
              name="roomNumber"
              label="No Room"
              rules={[{ required: true, message: "Nomor Room wajib diisi" }]}
            >
              <Input placeholder="Masukan No Room (cth: A1, B2)" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender Kamar (Opsi Kos)"
              rules={[{ required: true, message: "Pilih peruntukan gender kamar" }]}
            >
              <Select placeholder="Pilih Gender Kamar">
                <Select.Option value="male">
                  Laki-laki (Putra)
                </Select.Option>
                <Select.Option value="female">
                  Perempuan (Putri)
                </Select.Option>
                <Select.Option value="mixed">
                  Campur (Bebas)
                </Select.Option>
              </Select>
            </Form.Item>
          </Form>

          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-6 md:justify-end">
            <Button
              className="w-full md:w-auto"
              onClick={() => navigate(-1)}
            >
              Batal
            </Button>

            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={loading}
              className="w-full md:w-auto"
            >
              Simpan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddRoom;