import { Button, Input, Select, Form, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import AddCustomerModal from "../components/AddCustomerModal";
import { useState, useEffect } from "react";
import useAppStore from "../store/useAppStore";
import api from "../services/api";

function IsiRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");

  const user = useAppStore((state) => state.user);
  const selectedBranch = useAppStore((state) => state.selectedBranch);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [roomData, setRoomData] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rentalId, setRentalId] = useState(null);

  // generate tanggal 1 - 31 untuk H- Notifikasi
  const tanggalOptions = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: `H-${i + 1}`,
  }));

  useEffect(() => {
    if (!selectedBranch || !roomId) {
      navigate("/branch/room");
      return;
    }
    
    fetchCustomers();
    fetchRoomDetails();
  }, [roomId, selectedBranch, navigate]);

  const fetchRoomDetails = async () => {
    try {
      const res = await api.get(`/rooms/${roomId}`);
      const room = res.data;
      setRoomData(room);

      const activeRental = room.rentals && room.rentals.find(r => r.status === 'active');

      if (activeRental) {
        setIsReadOnly(true);
        setRentalId(activeRental.id);
        
        // Calculate H- Notif safely
        const sDate = new Date(activeRental.startDate);
        const dueDate = new Date(activeRental.dueDateDay);
        const notifDate = new Date(activeRental.notificationDay);
        
        // Count difference in days between due date and notif date
        const diffTime = Math.abs(dueDate - notifDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        form.setFieldsValue({
          roomNumber: room.roomNumber,
          customerId: activeRental.customerId,
          startDate: sDate.toISOString().split('T')[0],
          rentType: activeRental.rentType,
          hNotif: diffDays,
          monthlyPrice: activeRental.monthlyPrice,
          notes: activeRental.notes
        });
      } else {
        setIsReadOnly(false);
        form.setFieldsValue({
          roomNumber: room.roomNumber,
        });
      }
    } catch (error) {
      console.error(error);
      message.error("Gagal mengambil rincian data kamar");
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get(`/customers?branch_id=${selectedBranch.id}`);
      const rawData = res.data.data ? res.data.data : res.data;
      setCustomers(rawData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const sDate = new Date(values.startDate);
      const dueDate = new Date(sDate);
      if (values.rentType === "daily") dueDate.setDate(dueDate.getDate() + 1);
      else if (values.rentType === "weekly") dueDate.setDate(dueDate.getDate() + 7);
      else if (values.rentType === "monthly") dueDate.setMonth(dueDate.getMonth() + 1);

      const notifDate = new Date(dueDate);
      notifDate.setDate(notifDate.getDate() - parseInt(values.hNotif || 0));

      const payload = {
        branchId: selectedBranch.id,
        roomId: roomId,
        customerId: values.customerId,
        startDate: sDate.toISOString(),
        rentType: values.rentType,
        dueDateDay: dueDate.toISOString(),
        notificationDay: notifDate.toISOString(),
        monthlyPrice: Number(values.monthlyPrice),
        notes: values.notes,
        status: "active"
      };

      await api.post("/rentals", payload);
      message.success("Customer berhasil dimasukkan ke kamar");
      navigate("/branch/room");
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.meta?.error?.message 
        || error.response?.data?.message 
        || "Gagal memproses penugasan kamar";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeRentalIfAny = async () => {
    try {
      if (!rentalId) return;
      setLoading(true);
      await api.delete(`/rentals/${rentalId}`);
      message.success("Customer berhasil dikeluarkan dan kamar tersedia kembali");
      navigate("/branch/room");
    } catch (error) {
      console.error(error);
      message.error("Gagal mengeluarkan customer");
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <Header title="Isi Room" username={user?.ownerProfile?.name || user?.email} />

      <div className="flex-1 flex justify-center items-start mt-6 md:mt-8 px-3 md:px-4">
        <div className="w-full md:w-3/4 lg:w-1/2 bg-white shadow-lg rounded-xl p-4 md:p-6 mb-10">

          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
            <h2 className="text-md md:text-lg font-semibold">
              Pendaftaran Customer ke Room
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
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {/* Kolom Kiri */}
              <div>
                <Form.Item name="roomNumber" label="No Room">
                  <Input disabled className="!bg-gray-100 !text-black" />
                </Form.Item>

                <Form.Item 
                  name="customerId" 
                  label="Nama Customer (Penyewa)"
                  rules={[{ required: true, message: "Customer wajib dipilih" }]}
                >
                  <Select 
                    placeholder="Pilih Customer Terdaftar" 
                    showSearch 
                    optionFilterProp="label"
                    disabled={isReadOnly}
                  >
                    {customers
                      .filter(c => {
                        // Check if customer already has an active rental
                        const hasActiveRental = c.rentals && c.rentals.some(r => r.status === 'active');
                        if (hasActiveRental) return false;

                        // Check gender compatibility
                        return !roomData || roomData.gender === 'mixed' || c.gender === roomData.gender;
                      })
                      .map((c) => (
                        <Select.Option key={c.id} value={c.id} label={c.name}>
                          {c.name} ({c.gender === "male" ? "L" : "P"})
                        </Select.Option>
                      ))
                    }
                  </Select>
                  
                  {!isReadOnly && (
                    <Button
                      type="link"
                      className="!p-0 mt-1 text-blue-500"
                      onClick={() => setIsModalOpen(true)}
                    >
                      + Tambah Customer Baru
                    </Button>
                  )}
                </Form.Item>
                
                <Form.Item 
                  name="startDate" 
                  label="Tanggal Masuk"
                  rules={[{ required: true, message: "Tanggal masuk wajib diisi" }]}
                >
                  <Input type="date" className="w-full" />
                </Form.Item>

                <Form.Item 
                  name="rentType" 
                  label="Sewa"
                  rules={[{ required: true, message: "Pilih paket sewa" }]}
                >
                  <Select placeholder="Masukan Sewa">
                    <Select.Option value="daily">Harian</Select.Option>
                    <Select.Option value="weekly">Mingguan</Select.Option>
                    <Select.Option value="monthly">Bulanan</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Kolom Kanan */}
              <div>
                <Form.Item 
                  name="hNotif" 
                  label="H- Notifikasi Jatuh Tempo"
                  rules={[{ required: true, message: "Tentukan hari peringatan jatuh tempo" }]}
                >
                  <Select
                    showSearch
                    placeholder="Pilih Tanggal Notifikasi"
                    options={tanggalOptions}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>

                <Form.Item 
                  name="monthlyPrice" 
                  label="Biaya Room"
                  rules={[{ required: true, message: "Biaya sewa wajib diisi" }]}
                >
                  <Input
                    type="number"
                    addonBefore="Rp"
                    placeholder="Masukan Biaya Room"
                    className="w-full"
                  />
                </Form.Item>

                <Form.Item 
                  name="notes" 
                  label="Jumlah Customer Menginap / Catatan Khusus"
                >
                  <Input.TextArea
                    placeholder="Contoh: Berdua dengan teman..."
                    rows={4}
                  />
                </Form.Item>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-6 md:justify-end">
              {isReadOnly && (
                <Button
                  className="w-full md:w-auto !bg-red-500 hover:!bg-red-600 !text-white !border-none"
                  onClick={() => setOpenModal(true)}
                >
                  Hapus Customer
                </Button>
              )}

              <Button
                className="w-full md:w-auto"
                onClick={() => navigate(-1)}
              >
                Batal
              </Button>

        
            </div>
          </Form>

        </div>
      </div>
      
      <ConfirmDeleteModal
        open={openModal}
        title="Anda Yakin Ingin Hapus Isi Room?"
        description="Isi Room yang kamu hapus tidak dapat dikembalikan. Apakah kamu yakin ingin melanjutkan?"
        onCancel={() => setOpenModal(false)}
        onConfirm={removeRentalIfAny}
      />

      <AddCustomerModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccessCallback={(newCustomer) => {
          fetchCustomers();
          if (newCustomer?.id) {
            form.setFieldsValue({ customerId: newCustomer.id });
          }
        }}
      />
    </div>
  );
}

export default IsiRoom;