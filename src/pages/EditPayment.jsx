import { Button, Input, Upload, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import Header from "../components/Header";

function EditPayment() {
  const navigate = useNavigate();
  const username = "Manto Ariyansyah";

 return (
  <div className="min-h-screen bg-gray-100 flex flex-col">

    {/* HEADER STICKY */}
    <div className="sticky top-0 z-50 bg-gray-100 px-6 pt-6 pb-4">
      <Header title="Payment" username={username} />
    </div>

    {/* CONTENT */}
    <div className="flex-1 flex justify-center items-start mt-6 md:mt-8 px-3 md:px-4 overflow-y-auto">
      <div className="w-full md:w-3/5 lg:w-1/2 bg-white shadow-lg rounded-xl p-4 md:p-6">
        
        {/* Header Card */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
          <h2 className="text-md md:text-lg font-semibold">
            Edit Payment
          </h2>

          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => navigate(-1)}
          />
        </div>

        {/* FORM */}
        <form className="flex flex-col md:flex-row gap-6">
          
          {/* KIRI */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <label className="text-xs md:text-sm font-medium mb-1">
                Nama Kost
              </label>
              <Input value="Kost Anugrah" disabled />
            </div>

            <div>
              <label className="text-xs md:text-sm font-medium mb-1">
                Pilih Customer
              </label>
              <Input value="Manto Ariyansyah" disabled />
            </div>

            <div>
              <label className="text-xs md:text-sm font-medium mb-1">
                No Kost
              </label>
              <Input value="A1" disabled />
            </div>

            <div>
              <label className="text-xs md:text-sm font-medium mb-1">
                No WhatsApp
              </label>
              <Input value="0878787878" disabled />
            </div>
          </div>

          {/* KANAN */}
          <div className="flex-1 flex flex-col gap-4">

            <div>
              <label className="text-xs md:text-sm font-medium mb-1">
                Sewa
              </label>
              <Input value="Bulanan" disabled />
            </div>

            <div>
              <label className="text-xs md:text-sm font-medium mb-1">
                Pembayaran Ke-
              </label>
              <Input value="Bulan 5" disabled />
            </div>

            <div>
              <label className="text-xs md:text-sm font-medium mb-1">
                Biaya Room
              </label>
              <Input value="Rp. 1.000.000" disabled />
            </div>

            <div>
              <label className="text-xs md:text-sm font-medium mb-1">
                Foto Bukti Transfer
              </label>

              <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md h-25 p-4">
                <Upload>
                  <Button icon={<UploadOutlined />}>
                    Unggah Bukti
                  </Button>
                </Upload>
              </div>
            </div>

          </div>
        </form>

        {/* BUTTON */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-6 md:justify-end">
          <Button onClick={() => navigate(-1)} className="w-full md:w-auto">
            Batal
          </Button>

          <Button type="primary" className="w-full md:w-auto">
            Simpan
          </Button>
        </div>

      </div>
    </div>
  </div>
);
}

export default EditPayment;