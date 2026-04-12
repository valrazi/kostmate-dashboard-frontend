import { Modal, Button, Grid } from "antd";

const { useBreakpoint } = Grid;

function ConfirmDeleteModal({ 
  open, 
  onCancel, 
  onConfirm,
  title = "Anda Yakin Ingin Hapus Room?",
  description = "Data yang kamu hapus tidak dapat dikembalikan. Apakah kamu yakin ingin melanjutkan?"
}) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered={false}
      width={isMobile ? "90%" : 400}
      style={{
        top: isMobile ? 80 : 100,
        left: isMobile ? 0 : 100
      }}
      styles={{
        content: {
          borderRadius: 0,
          padding: isMobile ? "14px" : "16px",
          height: isMobile ? "auto" : "220px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }
      }}
    >
      {/* HEADER */}
      <div className="border-b pb-2 mb-3 border-gray-200">
        <h2 className="text-base md:text-lg font-semibold">
          {title}
        </h2>
      </div>

      {/* DESKRIPSI */}
      <p className="text-gray-500 text-xs md:text-sm flex-1">
        {description}
      </p>

      {/* BUTTON */}
      <div className="flex justify-end gap-2 mt-4">
        <Button size={isMobile ? "small" : "middle"} onClick={onCancel}>
          Batal
        </Button>

        <Button
          size={isMobile ? "small" : "middle"}
          danger
          type="primary"
          onClick={onConfirm}
          className="!bg-red-500 hover:!bg-red-600 !text-white !border-none"
        >
          Hapus
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;