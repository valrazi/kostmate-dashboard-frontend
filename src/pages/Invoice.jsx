import { useState, useEffect } from "react";
import { Button, Divider, Typography, Spin, message } from "antd";
import { ArrowLeftOutlined, PrinterOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";
import useAppStore from "../store/useAppStore";

const { Title, Text } = Typography;

function Invoice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAppStore((state) => state.user);
  const username = user?.name || "Admin";

  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/payments/${id}`);
        const paymentData = res.data;
        
        // Map response to expected structure
        const due = new Date(paymentData.dueDate);
        const pMonth = due.getMonth() + 1;
        const pYear = due.getFullYear();
        const invoiceNoStr = paymentData.id ? paymentData.id.substring(0, 6).toUpperCase() : '0001';

        setInvoiceData({
          invoiceNo: `INV-${pYear}-${invoiceNoStr}`,
          date: paymentData.paymentDate ? new Date(paymentData.paymentDate).toLocaleDateString("id-ID") : "-",
          dueDate: new Date(paymentData.dueDate).toLocaleDateString("id-ID"),
          status: paymentData.status === 'paid' ? 'Lunas' : 'Belum Lunas',
          customerName: paymentData.customer?.name || "-",
          roomNo: paymentData.room?.roomNumber || "-",
          paymentKe: `Bulan ${pMonth} ${pYear}`,
          amount: parseFloat(paymentData.amount),
          paymentMethod: paymentData.paymentMethod || "-",
          notes: paymentData.notes || ""
        });
      } catch (error) {
        console.error("Failed to fetch invoice:", error);
        message.error("Gagal mengambil data tagihan/invoice");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const formatRupiah = (number) => {
    if (!number && number !== 0) return "-";
    return "Rp " + number.toLocaleString("id-ID");
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Spin size="large" tip="Memuat data tagihan..." />
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Typography.Text type="danger">Data tagihan tidak ditemukan.</Typography.Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      {/* HEADER - Hidden when printing */}
      <div className="print:hidden sticky z-50 bg-gray-100 -mt-6 -mx-6 px-6 pt-6 pb-4 mb-2" style={{ top: "0px" }}>
        <Header title="Invoice Detail" username={username} />
        
        <div className="flex justify-between items-center mt-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate("/payment")}
          >
            Kembali
          </Button>
          <Button 
            type="primary" 
            icon={<PrinterOutlined />} 
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Cetak Invoice
          </Button>
        </div>
      </div>

      {/* INVOICE CARD */}
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 shadow-lg mt-4 print:shadow-none print:m-0 print:p-0">
        
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-100 pb-6 mb-6">
          <div>
            <Title level={2} className="!text-blue-600 !mb-0">KOSTMATE</Title>
            <Text className="text-gray-500 block mt-1">Sistem Manajemen Kos Profesional</Text>
            <Text className="text-gray-500 block">Jl. Merdeka No. 123, Jakarta</Text>
            <Text className="text-gray-500 block">Telp: 0812-3456-7890</Text>
          </div>
          <div className="text-right">
            <Title level={3} className="!text-gray-700 !mb-0">INVOICE</Title>
            <Text className="text-gray-500 block mt-1">No: <span className="font-semibold text-gray-800">{invoiceData.invoiceNo}</span></Text>
            <Text className="text-gray-500 block">Tanggal: {invoiceData.date}</Text>
            <div className="mt-2">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${invoiceData.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {invoiceData.status}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Billing Info */}
        <div className="flex justify-between mb-8">
          <div>
            <Text className="text-gray-500 block mb-1">Ditagihkan Kepada:</Text>
            <Text className="text-lg font-bold text-gray-800 block">{invoiceData.customerName}</Text>
            <Text className="text-gray-600 block">Kamar: {invoiceData.roomNo}</Text>
          </div>
          <div className="text-right">
            <Text className="text-gray-500 block mb-1">Detail Pembayaran:</Text>
            <Text className="text-gray-600 block">Jatuh Tempo: {invoiceData.dueDate}</Text>
            <Text className="text-gray-600 block">Metode: {invoiceData.paymentMethod}</Text>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="mb-8">
          <div className="bg-blue-50 grid grid-cols-12 p-3 font-semibold text-gray-700 border-y border-blue-100">
            <div className="col-span-8">Deskripsi</div>
            <div className="col-span-4 text-right">Total Harga</div>
          </div>
          
          <div className="grid grid-cols-12 p-3 border-b border-gray-100">
            <div className="col-span-8 text-gray-600">
              Biaya Sewa Kamar {invoiceData.roomNo} - {invoiceData.paymentKe}
            </div>
            <div className="col-span-4 text-right font-medium text-gray-800">
              {formatRupiah(invoiceData.amount)}
            </div>
          </div>
          
          {/* Total Section */}
          <div className="grid grid-cols-12 p-3 mt-4">
            <div className="col-span-8 text-right font-bold text-gray-700">
              Subtotal:
            </div>
            <div className="col-span-4 text-right font-bold text-gray-800">
              {formatRupiah(invoiceData.amount)}
            </div>
          </div>
          <div className="grid grid-cols-12 p-3 bg-blue-50 border-y border-blue-100">
            <div className="col-span-8 text-right font-bold text-blue-800 text-lg">
              TOTAL KESELURUHAN:
            </div>
            <div className="col-span-4 text-right font-bold text-blue-800 text-lg">
              {formatRupiah(invoiceData.amount)}
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-12 text-center text-gray-500 text-sm border-t border-gray-100 pt-6">
          <p className="font-semibold text-gray-600 mb-1">Terima kasih atas pembayaran Anda!</p>
          <p>Jika ada pertanyaan terkait invoice ini, silakan hubungi admin kostmate.</p>
          {invoiceData.notes && (
            <p className="mt-2 italic text-gray-400">"{invoiceData.notes}"</p>
          )}
        </div>
        
      </div>
      
      {/* CSS for printing */}
      <style>{`
        @media print {
          @page { size: auto; margin: 20mm; }
          body { background-color: white !important; }
        }
      `}</style>
    </div>
  );
}

export default Invoice;
