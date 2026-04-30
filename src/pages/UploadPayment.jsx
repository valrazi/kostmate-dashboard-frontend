import { useState, useEffect } from "react";
import { Button, Input, Upload, message, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import api from "../services/api";
import useAppStore from "../store/useAppStore";

function UploadPayment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAppStore((state) => state.user);
  const username = user?.name || "Admin";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  
  // File upload state
  const [fileList, setFileList] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await api.get(`/payments/${id}`);
        setPaymentData(response.data);
      } catch (error) {
        console.error("Failed to fetch payment:", error);
        message.error("Gagal mengambil data tagihan");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPayment();
    }
  }, [id, navigate]);

  const formatRupiah = (number) => {
    if (!number && number !== 0) return "-";
    return "Rp " + number.toLocaleString("id-ID");
  };

  // Custom upload request
  const customUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    
    setUploadingImage(true);
    try {
      // Endpoint from media module
      const res = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Media upload returns the url
      const uploadedUrl = res.data?.url || res.url;
      setImageUrl(uploadedUrl);
      onSuccess(res, file);
      message.success("Foto berhasil diunggah");
    } catch (error) {
      console.error("Upload error:", error);
      onError(error);
      message.error("Gagal mengunggah foto");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUploadChange = (info) => {
    setFileList(info.fileList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      return message.warning("Silakan unggah bukti transfer terlebih dahulu!");
    }

    setSubmitting(true);
    try {
      await api.patch(`/payments/${id}`, {
        invoiceUrl: imageUrl,
        status: "paid",
        paymentDate: new Date().toISOString()
      });
      message.success("Pembayaran berhasil dikonfirmasi!");
      navigate("/payment");
    } catch (error) {
      console.error("Submit error:", error);
      message.error("Gagal menyimpan pembayaran");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Memuat data..." />
      </div>
    );
  }

  // Formatting display values
  const rentTypeMap = {
    'monthly': 'Bulanan',
    'daily': 'Harian',
    'weekly': 'Mingguan'
  };
  
  let paymentKe = "-";
  if (paymentData?.dueDate) {
    const due = new Date(paymentData.dueDate);
    paymentKe = `Bulan ${due.getMonth() + 1} Tahun ${due.getFullYear()}`;
  }

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      {/* HEADER STICKY */}
      <div className="sticky top-0 z-50 bg-gray-100 px-6 pt-6 pb-4">
        <Header title="Payment" username={username} />
      </div>

      {/* Konten */}
      <div className="flex-1 flex justify-center items-start mt-6 md:mt-8 px-3 md:px-4 pb-10">
        <div className="w-full md:w-3/5 lg:w-1/2 bg-white shadow-lg rounded-xl p-4 md:p-6">
          
          {/* Header Card */}
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
            <h2 className="text-md md:text-lg font-semibold">
              Upload Payment
            </h2>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => navigate(-1)}
            />
          </div>

          {/* Form */}
          <form className="flex flex-col md:flex-row gap-6" onSubmit={handleSubmit}>
            
            {/* Kiri */}
            <div className="flex-1 flex flex-col gap-4">
              
              <div>
                <label className="text-xs md:text-sm font-medium mb-1 block">
                  Nama Cabang
                </label>
                <Input value={paymentData?.branch?.name || "Kostmate"} disabled className="w-full" />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1 block">
                  Nama Customer
                </label>
                <Input value={paymentData?.customer?.name || "-"} disabled className="w-full" />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1 block">
                  No Kost
                </label>
                <Input value={paymentData?.room?.roomNumber || "-"} disabled className="w-full" />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1 block">
                  No WhatsApp
                </label>
                <Input value={paymentData?.customer?.whatsappNumber || "-"} disabled className="w-full" />
              </div>

            </div>

            {/* Kanan */}
            <div className="flex-1 flex flex-col gap-4">
              
              <div>
                <label className="text-xs md:text-sm font-medium mb-1 block">
                  Sewa
                </label>
                <Input value={rentTypeMap[paymentData?.rental?.rentType] || "-"} disabled className="w-full" />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1 block">
                  Pembayaran Ke-
                </label>
                <Input value={paymentKe} disabled className="w-full" />
              </div>

              <div>
                <label className="text-xs md:text-sm font-medium mb-1 block">
                  Biaya Room
                </label>
                <Input value={formatRupiah(parseFloat(paymentData?.amount))} disabled className="w-full font-bold text-gray-800" />
              </div>
              
              <div>
                <label className="text-xs md:text-sm font-medium mb-1 block">
                  Foto Bukti Transfer <span className="text-red-500">*</span>
                </label>

                <div className="flex flex-col items-center justify-center border border-dashed border-blue-300 rounded-md p-4 bg-blue-50">
                  <Upload
                    customRequest={customUpload}
                    fileList={fileList}
                    onChange={handleUploadChange}
                    maxCount={1}
                    listType="picture"
                    accept="image/*"
                  >
                    <Button 
                      icon={<UploadOutlined />} 
                      loading={uploadingImage}
                      className="mb-2"
                    >
                      {imageUrl ? 'Ganti Bukti' : 'Unggah Bukti'}
                    </Button>
                  </Upload>
                  {!imageUrl && (
                    <span className="text-gray-500 text-xs md:text-sm mt-1 text-center">
                      Masukan Foto Bukti Transfer (Max 5MB)
                    </span>
                  )}
                </div>
              </div>

            </div>
          </form>

          {/* Tombol */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-8 pt-4 border-t border-gray-100 md:justify-end">
            <Button
              className="w-full md:w-32"
              onClick={() => navigate(-1)}
              disabled={submitting || uploadingImage}
            >
              Batal
            </Button>

            <Button
              type="primary"
              onClick={handleSubmit}
              loading={submitting}
              disabled={uploadingImage}
              className="w-full md:w-32 bg-blue-600"
            >
              Simpan
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default UploadPayment;