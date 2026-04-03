import { Button, Input, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import Header from "../components/Header";

function EditBranchRoom() {
  const navigate = useNavigate();
  const username = "Manto Ariyansyah";

  return (
    <div className="bg-gray-100 flex flex-col">
      
      {/* Header */}
      <Header title="Branch Room" username={username} />

      {/* Konten */}
      <div className="flex-1 flex justify-center items-start mt-6 md:mt-8 px-3 md:px-4">
        <div className="w-full md:w-3/5 lg:w-1/2 bg-white shadow-lg rounded-xl p-4 md:p-6">
          
          {/* Header Card */}
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
            <h2 className="text-md md:text-lg font-semibold">
              Edit Branch Room
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
                  Nama Kost
                </label>
                <Input value="Kost Anugrah" />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1">
                  Nama Pemilik
                </label>
                <Input value="Manto Ariyansyah" />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1">
                  No WhatsApp
                </label>
                <Input value="0878787878" />
              </div>
            </div>

            {/* Kanan */}
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="text-xs md:text-sm font-medium mb-1">
                  Foto Kost
                </label>

                <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md h-25 p-4">
                  <Upload>
                    <Button icon={<UploadOutlined />}>
                      Tambah Foto
                    </Button>
                  </Upload>
                  <span className="text-gray-500 text-xs md:text-sm mt-2 text-center">
                    Masukan Foto ke Unggah
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1">
                  Alamat Kost
                </label>
                <Input.TextArea value="jalan akses UI" rows={1} />
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

export default EditBranchRoom;