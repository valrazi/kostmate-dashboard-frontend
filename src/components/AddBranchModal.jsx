import { Modal, Button, Input, Upload, Grid, Form, message, Select } from "antd";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import api from "../services/api";
import useAppStore from "../store/useAppStore";

const { useBreakpoint } = Grid;

function AddBranchModal({ open, onCancel, onSuccess }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const user = useAppStore((state) => state.user);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        name: values.name,
        whatsappNumber: values.whatsappNumber,
        address: values.address,
        genderPreference: values.genderPreference,
        roomQuota: Number(values.roomQuota) || 0,
        ownerId: user?.ownerProfile?.id,
      };

      await api.post("/branches", payload);
      message.success("Berhasil menambahkan fasilitas (branch)");
      form.resetFields();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.meta?.error?.message 
        || error.response?.data?.message 
        || "Gagal menambah branch";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.resetFields();
        if(onCancel) onCancel();
      }}
      footer={null}
      width={isMobile ? "95%" : 550}
      centered
      closable={false}
      destroyOnClose
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
        <h2 className="text-md md:text-lg font-semibold">
          Tambah Branch
        </h2>
        <Button type="text" icon={<CloseOutlined />} onClick={onCancel} />
      </div>

      {/* FORM */}
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
        className="flex flex-col md:flex-row gap-6"
      >
        {/* KIRI */}
        <div className="flex-1 flex flex-col">
          <Form.Item
            name="name"
            label="Nama Kost"
            rules={[{ required: true, message: "Nama kost wajib diisi" }]}
          >
            <Input placeholder="Masukan Nama Kost" />
          </Form.Item>

          <Form.Item
            name="genderPreference"
            label="Preferensi Gender"
            initialValue="mixed"
            rules={[{ required: true, message: "Pilih preferensi gender" }]}
          >
            <Select>
              <Select.Option value="mixed">Campur (Mixed)</Select.Option>
              <Select.Option value="male">Khusus Pria</Select.Option>
              <Select.Option value="female">Khusus Wanita</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="whatsappNumber"
            label="No WhatsApp"
            rules={[{ required: true, message: "Nomor handphone wajib diisi" }]}
          >
            <Input placeholder="Masukan No WhatsApp" />
          </Form.Item>

          <Form.Item
            name="roomQuota"
            label="Kapasitas Ruangan (Quota)"
            rules={[{ required: true, message: "Kapasitas ruangan wajib diisi" }]}
          >
            <Input type="number" placeholder="Masukan total kuota ruangan" />
          </Form.Item>
        </div>

        {/* KANAN */}
        <div className="flex-1 flex flex-col">
          <Form.Item
            name="address"
            label="Alamat Kost"
            rules={[{ required: true, message: "Alamat wajib diisi" }]}
          >
            <Input.TextArea placeholder="Masukan Alamat Kost" rows={4} />
          </Form.Item>
          
          <Form.Item label="Foto Kost">
            <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md p-4">
              <Upload>
                <Button icon={<UploadOutlined />}>
                  Tambah Foto
                </Button>
              </Upload>
              <span className="text-gray-500 text-xs mt-2 text-center">
                Masukan Foto ke Unggah (Fitur menyusul)
              </span>
            </div>
          </Form.Item>
        </div>
      </Form>

      {/* BUTTON */}
      <div className="flex justify-end gap-2 mt-2">
        <Button onClick={onCancel}>Batal</Button>
        <Button type="primary" onClick={() => form.submit()} loading={loading}>
          Simpan
        </Button>
      </div>
    </Modal>
  );
}

export default AddBranchModal;