import { Button, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useState } from "react";
import AddCustomerModal from "../components/AddCustomerModal";

function IsiRoom() {
  const navigate = useNavigate();
  const username = "Manto Ariyansyah";

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ STATE MODAL
  const [openModal, setOpenModal] = useState(false);

  // ✅ generate tanggal 1 - 31
  const tanggalOptions = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  }));

  return (
    <div className="bg-gray-100 flex flex-col">

      {/* Header */}
      <Header title="Room" username={username} />

      {/* Konten */}
      <div className="flex-1 flex justify-center items-start mt-6 md:mt-8 px-3 md:px-4">
        <div className="w-full md:w-3/5 lg:w-1/2 bg-white shadow-lg rounded-xl p-4 md:p-5">

          {/* Header Card */}
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
            <h2 className="text-md md:text-lg font-semibold">
              Isi Room
            </h2>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => navigate(-1)}
            />
          </div>

          {/* Form */}
          <form className="flex flex-col md:flex-row gap-6">

            {/* Kiri */}
            <div className="flex-1 flex flex-col gap-4">

              <div>
                <label className="text-xs md:text-sm font-medium mb-1">
                  No Room
                </label>
                <Input value="A1" disabled />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1">
                  Nama Customer
                </label>
                <Select placeholder="Pilih Customer" className="w-full">
                  <Select.Option value="laki">Bayu</Select.Option>
                  <Select.Option value="perempuan">Ival</Select.Option>
                </Select>

                {/* ✅ BUTTON TAMBAH */}
                <Button
                  type="link"
                  className="!p-0 mt-1 text-blue-500"
                  onClick={() => setIsModalOpen(true)}
                >
                  + Tambah Customer
                </Button>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1">
                  Jenis Kelamin
                </label>
                <Select placeholder="Pilih Gender" className="w-full">
                  <Select.Option value="laki">Laki-laki</Select.Option>
                  <Select.Option value="perempuan">Perempuan</Select.Option>
                </Select>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1">
                  Tanggal Masuk
                </label>
                <Input type="date" className="w-full" />
              </div>

            </div>

            {/* Kanan */}
            <div className="flex-1 flex flex-col gap-4">

              <div>
                <label className="text-xs md:text-sm font-medium mb-1">
                  Sewa
                </label>
                <Select placeholder="Masukan Sewa" className="w-full">
                  <Select.Option value="laki">Mingguan</Select.Option>
                  <Select.Option value="perempuan">Bulanan</Select.Option>
                  <Select.Option value="perempuan">Tahunan</Select.Option>
                </Select>
              </div>

              {/* ✅ TANGGAL NOTIFIKASI (DROPDOWN + SEARCH) */}
              <div>
                <label className="text-xs md:text-sm font-medium mb-1">
                  H- Notifikasi
                </label>
                <Select
                  showSearch
                  placeholder="Pilih Tanggal Notifikasi"
                  className="w-full"
                  options={tanggalOptions}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1">
                  Biaya Room
                </label>
                <Input
                  type="number"
                  addonBefore="Rp"
                  placeholder="Masukan Biaya Room"
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1">
                  Jumlah Customer / Catatan
                </label>
                <Input.TextArea
                  placeholder="Masukan Jumlah Customer / Catatan"
                  rows={2}
                />
              </div>

            </div>

          </form>

          {/* Tombol */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-6 md:justify-end">
            {/* ✅ TOMBOL HAPUS → BUKA MODAL */}
            <Button
              className="w-full md:w-auto !bg-red-500 hover:!bg-red-600 !text-white !border-none"
              onClick={() => setOpenModal(true)}
            >
              Hapus
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full md:w-auto"
            >
              Simpan
            </Button>
          </div>
        </div>
        {/* ✅ MODAL DELETE */}
        <ConfirmDeleteModal
          open={openModal}
          title="Anda Yakin Ingin Hapus Isi Room?"
          description="Isi Room yang kamu hapus tidak dapat dikembalikan. Apakah kamu yakin ingin melanjutkan?"
          onCancel={() => setOpenModal(false)}
          onConfirm={() => {
            setOpenModal(false);

            // 👉 nanti ganti dengan API delete
            console.log("Room dihapus");

            navigate("/branch/room");
          }}
        />
      </div>

      <AddCustomerModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default IsiRoom;