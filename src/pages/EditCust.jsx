import { Button, Input, Upload, Select, Form, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import useAppStore from "../store/useAppStore";
import api from "../services/api";

const { Option } = Select;

function EditCust() {
  const navigate = useNavigate();
  const location = useLocation();
  const record = location.state?.record;
  
  const user = useAppStore((state) => state.user);
  const selectedBranch = useAppStore((state) => state.selectedBranch);
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (!selectedBranch || !record) {
      navigate("/cust");
      return;
    }

    form.setFieldsValue({
      name: record.name,
      gender: record.gender,
      whatsappNumber: record.whatsappNumber,
      emergencyContactName: record.emergencyContactName,
      emergencyPhoneNumber: record.emergencyPhoneNumber,
      identityUrl: record.identityUrl,
    });

    if (record.identityUrl) {
      setFileList([
        { uid: '-1', name: 'Foto KTP', status: 'done', url: record.identityUrl }
      ]);
    }
  }, [record, selectedBranch, form, navigate]);

  const customUpload = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.data?.url || res.data?.url;
      form.setFieldsValue({ identityUrl: url });
      setFileList([{ uid: file.uid, name: file.name, status: 'done', url }]);
      onSuccess("ok");
      message.success("KTP berhasil diunggah");
    } catch (error) {
      console.error(error);
      onError(error);
      message.error("Gagal mengunggah gambar KTP");
    }
  };

  const handleRemoveFile = () => {
    setFileList([]);
    form.setFieldsValue({ identityUrl: null });
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        branchId: selectedBranch.id,
      };

      await api.patch(`/customers/${record.id}`, payload);
      message.success("Customer berhasil diperbarui");
      navigate("/users");
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.meta?.error?.message 
        || error.response?.data?.message 
        || "Gagal memperbarui customer";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <Header title="Customer" username={user?.ownerProfile?.name || user?.email} />

      <div className="flex-1 flex justify-center items-start mt-6 md:mt-8 px-3 md:px-4">
        <div className="w-full md:w-4/5 lg:w-3/5 bg-white shadow-lg rounded-xl p-4 md:p-6 mb-10">
          
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
            <h2 className="text-md md:text-lg font-semibold">
              Edit Customer
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
            className="flex flex-col md:flex-row gap-6"
          >
            {/* Kiri */}
            <div className="flex-1 flex flex-col">
              <Form.Item
                name="name"
                label="Nama Customer"
                rules={[{ required: true, message: "Nama wajib diisi" }]}
              >
                <Input placeholder="Masukan Nama Customer" />
              </Form.Item>

              <Form.Item
                name="gender"
                label="Jenis Kelamin"
                rules={[{ required: true, message: "Pilih jenis kelamin" }]}
              >
                <Select placeholder="Pilih Jenis Kelamin">
                  <Option value="male">Laki-laki</Option>
                  <Option value="female">Perempuan</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="whatsappNumber"
                label="No WhatsApp"
                rules={[{ required: true, message: "Nomor WhatsApp wajib diisi" }]}
              >
                <Input placeholder="Masukan No WhatsApp" />
              </Form.Item>
            </div>

            {/* Kanan */}
            <div className="flex-1 flex flex-col">
              <Form.Item
                name="emergencyContactName"
                label="Nama Kontak Darurat"
                rules={[{ required: true, message: "Nama kontak darurat wajib diisi" }]}
              >
                <Input placeholder="Nama (Misal: Keluarga/Ibu/Saudara)" />
              </Form.Item>

              <Form.Item
                name="emergencyPhoneNumber"
                label="No Darurat"
                rules={[{ required: true, message: "No Darurat wajib diisi" }]}
              >
                <Input placeholder="Masukan No Darurat" />
              </Form.Item>

              <Form.Item
                name="identityUrl"
                label="Foto KTP"
                rules={[{ required: true, message: "KTP wajib diunggah" }]}
              >
                <Upload 
                  customRequest={customUpload}
                  fileList={fileList}
                  onRemove={handleRemoveFile}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Ubah KTP</Button>
                </Upload>
              </Form.Item>
            </div>
          </Form>

          <div className="flex flex-col md:flex-row gap-3 mt-6 md:justify-end">
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

export default EditCust;