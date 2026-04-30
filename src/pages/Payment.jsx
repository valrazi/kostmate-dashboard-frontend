import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Select,
  Table,
  Space,
  Tag,
  message
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useAppStore from "../store/useAppStore";

const { Option } = Select;

function Payment() {
  const user = useAppStore((state) => state.user);
  const username = user?.name || "Admin";
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // STATE FILTER
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const months = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
  ];

  const years = [2023, 2024, 2025, 2026];

  // FETCH DATA
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/payments');
      // Format response to table data
      const paymentsData = response.data || [];
      const formattedData = paymentsData.map((item, index) => {
        // Find payment month/year from dueDate
        const due = new Date(item.dueDate);
        const pMonth = due.getMonth(); // 0-11
        const pYear = due.getFullYear();
        
        return {
          key: item.id,
          id: item.id,
          room: item.room?.roomNumber || "-",
          name: item.customer?.name || "-",
          paymentKe: `Bulan ${pMonth + 1}`,
          date: item.paymentDate ? new Date(item.paymentDate).toLocaleDateString("id-ID") : "-",
          price: parseFloat(item.amount),
          status: item.status === 'paid' ? 'Lunas' : 'Belum Lunas',
          month: pMonth + 1,
          year: pYear,
        };
      });
      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      message.error("Gagal mengambil data pembayaran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // FORMAT RUPIAH
  const formatRupiah = (number) => {
    if (!number && number !== 0) return "-";
    return "Rp " + number.toLocaleString("id-ID");
  };

  // FILTER HANDLER
  const handleYearChange = (value) => {
    setSelectedYear(value);
    setSelectedMonth(null); // reset bulan kalau tahun berubah
  };

  // Filtered Data
  const filteredData = data.filter((item) => {
    if (selectedYear && item.year !== selectedYear) return false;
    if (selectedMonth && item.month !== selectedMonth) return false;
    return true;
  });

  // COLUMNS
  const columns = [
    { title: "No Room", dataIndex: "room", key: "room" },
    { title: "Nama Customer", dataIndex: "name", key: "name" },
    { title: "Pembayaran Ke-", dataIndex: "paymentKe", key: "paymentKe" },
    { title: "Tanggal Pembayaran", dataIndex: "date", key: "date" },

    {
      title: "Biaya Room",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="font-medium">
          {formatRupiah(price)}
        </span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag color={text === "Lunas" ? "green" : "red"}>
          {text}
        </Tag>
      ),
    },

    {
      title: "Aksi",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            className="!border-blue-500 !text-blue-500 hover:!text-white hover:!bg-blue-500 hover:!border-blue-500"
            onClick={() => navigate(`/payment/invoice/${record.id}`)}
          >
            Invoice
          </Button>

          {record.status === "Belum Lunas" ? (
            <Button
              size="small"
              className="!border-blue-500 !text-blue-500 hover:!text-white hover:!bg-blue-500 hover:!border-blue-500"
              onClick={() => navigate(`/payment/upload/${record.id}`)}
            >
              Upload
            </Button>
          ) : (
            <Button
              size="small"
              className="!border-blue-500 !text-blue-500 hover:!text-white hover:!bg-blue-500 hover:!border-blue-500"
              onClick={() => navigate("/payment/edit")}
            >
              Edit
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="sticky z-50 bg-gray-100 -mt-6 -mx-6 px-6 pt-6 pb-4 mb-2" style={{ top: "0px" }}>
        <Header title="Payment" username={username} />

        <div className="w-full md:w-96 max-w-md flex items-center gap-2 mt-4">
          <Input
            placeholder="Cari Nama Customer"
            prefix={<SearchOutlined />}
          />
        </div>
      </div>

      {/* CARD */}
      <div className="p-4 md:p-6 bg-white rounded-xl shadow-md">

        {/* FILTER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
          <h2 className="text-lg font-semibold">Payment</h2>

          <div className="flex gap-2 flex-wrap">

            {/* YEAR (WAJIB PILIH DULU) */}
            <Select
              placeholder="Pilih Tahun"
              className="w-32"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {years.map((t) => (
                <Option key={t} value={t}>{t}</Option>
              ))}
            </Select>

            {/* MONTH (LOCK KALAU TAHUN BELUM DIPILIH) */}
            <Select
              placeholder="Pilih Bulan"
              className="w-40"
              value={selectedMonth}
              onChange={(value) => setSelectedMonth(value)}
              disabled={!selectedYear}
            >
              {months.map((b, i) => (
                <Option key={i} value={i + 1}>
                  {b}
                </Option>
              ))}
            </Select>

          </div>
        </div>

        <div className="border-t border-gray-200 mb-2" />

        {/* TABLE */}
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          scroll={{ x: 800 }}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default Payment;