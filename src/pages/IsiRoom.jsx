import { Button, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import Header from "../components/Header";

function IsiRoom() {
  const navigate = useNavigate();
  const username = "Manto Ariyansyah";

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
                <Input placeholder="Masukan No Room" />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1">
                  Nama Penghuni
                </label>
                <Input placeholder="Masukan Nama Penghuni" />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1">
                  Gender
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
                  Tanggal Keluar
                </label>
                <Input type="date" className="w-full" />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1">
                  Tanggal Notifikasi
                </label>
                <Input type="date" className="w-full" />
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
                  Jumlah Penghuni / Catatan
                </label>
                <Input.TextArea
                  placeholder="Masukan Jumlah Penghuni / Catatan"
                  rows={2}
                />
              </div>

            </div>

          </form>

          {/* Tombol */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-6 md:justify-end">
            <Button
              className="w-full md:w-auto"
              onClick={() => navigate(-1)}
            >
              Batal
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
      </div>
    </div>
  );
}

export default IsiRoom;