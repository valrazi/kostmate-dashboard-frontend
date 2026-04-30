import { Button, Input, Select, Form, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useState, useEffect } from "react";
import useAppStore from "../store/useAppStore";
import api from "../services/api";
import Header from "../components/Header";

function EditRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const record = location.state?.record;

  const user = useAppStore((state) => state.user);
  const selectedBranch = useAppStore((state) => state.selectedBranch);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!selectedBranch || !record) {
      navigate("/branch/room");
      return;
    }

    if (record.status === "Terisi" || record.status === "filled") {
      message.error("Kamar sedang ditempati, tidak dapat diubah.");
      navigate("/branch/room");
      return;
    }

    form.setFieldsValue({
      roomNumber: record.roomNumber,
      gender: record.gender || "mixed",
      status: record.status === "Terisi" ? "filled" : record.status === "Maintenance" ? "maintenance" : "available",
    });
  }, [record, selectedBranch, form, navigate]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        branchId: selectedBranch.id,
      };

      await api.patch(`/rooms/${record.id}`, payload);
      message.success("Room berhasil diperbarui");
      navigate("/branch/room");
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.meta?.error?.message 
        || error.response?.data?.message 
        || "Gagal memperbarui room";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setOpenModal(false);
      await api.delete(`/rooms/${record.id}`);
      message.success("Room berhasil dihapus");
      navigate("/branch/room");
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.meta?.error?.message 
        || error.response?.data?.message 
        || "Gagal menghapus room";
      message.error(errorMessage);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <Header title="Room" username={user?.ownerProfile?.name || user?.email} />

      <div className="flex-1 flex justify-center items-start mt-6 md:mt-8 px-3 md:px-4">
        <div className="w-full md:w-2/5 bg-white shadow-lg rounded-xl p-4 md:p-6">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
            <h2 className="text-md md:text-lg font-semibold">
              Edit Room
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
              <Input placeholder="Masukan No Room" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender Kamar (Opsi Kos)"
              rules={[{ required: true, message: "Pilih peruntukan gender kamar" }]}
            >
              <Select placeholder="Pilih Gender">
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

            <Form.Item
              name="status"
              label="Status Kamar"
              rules={[{ required: true, message: "Status wajib dipilih" }]}
            >
              <Select placeholder="Pilih Status">
                <Select.Option value="available">
                  Tersedia / Kosong
                </Select.Option>
                <Select.Option value="filled">
                  Terisi
                </Select.Option>
                <Select.Option value="maintenance">
                  Dalam Perbaikan
                </Select.Option>
              </Select>
            </Form.Item>
          </Form>

          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-6 md:justify-end">
            <Button
              className="w-full md:w-auto !bg-red-500 hover:!bg-red-600 !text-white !border-none"
              onClick={() => setOpenModal(true)}
            >
              Hapus
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

      <ConfirmDeleteModal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default EditRoom;