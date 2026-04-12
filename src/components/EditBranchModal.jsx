import { Modal, Button, Input, Upload } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

function EditBranchRoomModal({ open, onCancel, data }) {
  
  // DETECT MOBILE
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={isMobile ? "95%" : 500}
      centered
      closable={false}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
        <h2 className="text-md md:text-lg font-semibold">
          Edit Branch Room
        </h2>
        <Button type="text" icon={<CloseOutlined />} onClick={onCancel} />
      </div>

      {/* FORM */}
      <form className="flex flex-col md:flex-row gap-6 mt-4">
        
        {/* KIRI */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1">Nama Kost</label>
            <Input value={data?.name || "Kost Anugrah"} />
          </div>

          <div>
            <label className="text-sm font-medium mb-1">Nama Pemilik</label>
            <Input value="Manto Ariyansyah" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1">No WhatsApp</label>
            <Input value="0878787878" />
          </div>
        </div>

        {/* KANAN */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium mb-1">Foto Kost</label>

            <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md h-25 p-4">
              <Upload>
                <Button icon={<UploadOutlined />}>
                  Tambah Foto
                </Button>
              </Upload>
              <span className="text-gray-500 text-sm mt-2 text-center">
                Masukan Foto ke Unggah
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1">Alamat Kost</label>
            <Input.TextArea value="jalan akses UI" rows={1} />
          </div>
        </div>
      </form>

      {/* BUTTON */}
      <div className="flex justify-end gap-3 mt-6">
        <Button onClick={onCancel}>Batal</Button>
        <Button type="primary">Simpan</Button>
      </div>
    </Modal>
  );
}

export default EditBranchRoomModal;