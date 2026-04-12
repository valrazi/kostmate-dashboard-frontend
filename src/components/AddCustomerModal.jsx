import { Modal, Button, Input, Upload, Select, Grid } from "antd";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { useBreakpoint } = Grid;

function AddCustomerModal({ open, onCancel }) {
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
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
        <h2 className="text-md md:text-lg font-semibold">
          Tambah Customer
        </h2>
        <Button type="text" icon={<CloseOutlined />} onClick={onCancel} />
      </div>

      {/* Form */}
      <form className="flex flex-col md:flex-row gap-6">

        {/* Kiri */}
        <div className="flex-1 flex flex-col gap-4">

          <div>
            <label className="text-xs md:text-sm font-medium mb-1">
              Nama Customer
            </label>
            <Input placeholder="Masukan Nama Customer" />
          </div>

          <div>
            <label className="text-xs md:text-sm font-medium mb-1">
              Jenis Kelamin
            </label>
            <Select placeholder="Pilih Jenis Kelamin" className="w-full">
              <Option value="L">Laki-laki</Option>
              <Option value="P">Perempuan</Option>
            </Select>
          </div>

          <div>
            <label className="text-xs md:text-sm font-medium mb-1">
              No WhatsApp
            </label>
            <Input placeholder="Masukan No WhatsApp" />
          </div>

        </div>

        {/* Kanan */}
        <div className="flex-1 flex flex-col gap-4">

          <div>
            <label className="text-xs md:text-sm font-medium mb-1">
              No Darurat
            </label>
            <Input placeholder="Masukan No Darurat" />
          </div>

          <div>
            <label className="text-xs md:text-sm font-medium mb-1">
              Foto KTP
            </label>

            <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-md h-28 p-4">
              <Upload>
                <Button icon={<UploadOutlined />}>
                  Unggah KTP
                </Button>
              </Upload>
              <span className="text-gray-500 text-xs mt-2 text-center">
                Masukan Foto KTP
              </span>
            </div>
          </div>

        </div>

      </form>

      {/* Button */}
      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onCancel}>Batal</Button>
        <Button type="primary">Simpan</Button>
      </div>
    </Modal>
  );
}

export default AddCustomerModal;