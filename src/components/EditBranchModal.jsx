import { Modal, Button, Input, Upload, Form, message, Select } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "../services/api";

function EditBranchRoomModal({ open, onCancel, onSuccess, data }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (open && data) {
      form.setFieldsValue({
        name: data.name,
        whatsappNumber: data.whatsappNumber,
        address: data.address,
        genderPreference: data.genderPreference || "mixed",
        roomQuota: data.roomQuota || 0
      });
    }
  }, [open, data, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        name: values.name,
        whatsappNumber: values.whatsappNumber,
        address: values.address,
        genderPreference: values.genderPreference,
        roomQuota: Number(values.roomQuota) || 0
      };

      await api.patch(`/branches/${data.id}`, payload);
      message.success("Berhasil memperbarui fasilitas (branch)");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.meta?.error?.message 
        || error.response?.data?.message 
        || "Gagal memperbarui branch";
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
          Edit Branch
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
          >
            <Input.TextArea placeholder="Masukan Alamat Kost" rows={4} />
          </Form.Item>

          <Form.Item label="Foto Kost">
            <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md p-4">
              <Upload>
                <Button icon={<UploadOutlined />}>
                  Ubah Foto
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
      <div className="flex justify-end gap-3 mt-2">
        <Button onClick={onCancel}>Batal</Button>
        <Button type="primary" onClick={() => form.submit()} loading={loading}>
          Simpan
        </Button>
      </div>
    </Modal>
  );
}

export default EditBranchRoomModal;