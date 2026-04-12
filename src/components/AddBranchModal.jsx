import { Modal, Button, Input, Upload, Grid } from "antd";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

function AddBranchModal({ open, onCancel }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

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
          Tambah Branch
        </h2>
        <Button type="text" icon={<CloseOutlined />} onClick={onCancel} />
      </div>

      {/* FORM */}
      <form className="flex flex-col md:flex-row gap-6">

        {/* KIRI */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <label className="text-xs md:text-sm font-medium mb-1">
              Nama Kost
            </label>
            <Input placeholder="Masukan Nama Kost" />
          </div>

          <div>
            <label className="text-xs md:text-sm font-medium mb-1">
              Nama Pemilik
            </label>
            <Input placeholder="Masukan Nama Pemilik" />
          </div>

          <div>
            <label className="text-xs md:text-sm font-medium mb-1">
              No WhatsApp
            </label>
            <Input placeholder="Masukan No WhatsApp" />
          </div>
        </div>

        {/* KANAN */}
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

              <span className="text-gray-500 text-xs mt-2 text-center">
                Masukan Foto ke Unggah
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs md:text-sm font-medium mb-1">
              Alamat Kost
            </label>
            <Input.TextArea placeholder="Masukan Alamat Kost" rows={1} />
          </div>
        </div>

      </form>

      {/* BUTTON */}
      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onCancel}>Batal</Button>
        <Button type="primary">Simpan</Button>
      </div>
    </Modal>
  );
}

export default AddBranchModal;