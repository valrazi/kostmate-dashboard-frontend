import { useState } from "react";
import {
  Input,
  Button,
  Select,
  Table,
  Space,
  Tag,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

function Payment() {
  const username = "Manto Ariyansyah";
  const navigate = useNavigate();

  // STATE FILTER
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const months = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
  ];

  const years = [2023, 2024, 2025, 2026];

  // FORMAT RUPIAH
  const formatRupiah = (number) => {
    if (!number) return "-";
    return "Rp " + number.toLocaleString("id-ID");
  };

  // DATA
  const data = [
    { key: 1, room: "A1", name: "Manto Ariyansyah", paymentKe: "Bulan 5", date: "22/5/2025", price: 500000, status: "Lunas" },
    { key: 2, room: "A2", name: "Andi Saputra", paymentKe: "Bulan 5", date: "-", price: 0, status: "Belum Lunas" },
    { key: 3, room: "A3", name: "Budi Santoso", paymentKe: "Bulan 5", date: "20/5/2025", price: 1500000, status: "Lunas" },
  ];

  // FILTER HANDLER
  const handleYearChange = (value) => {
    setSelectedYear(value);
    setSelectedMonth(null); // reset bulan kalau tahun berubah
  };

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
          {record.status === "Belum Lunas" ? (
            <Button
              size="small"
              className="!border-blue-500 !text-blue-500 hover:!text-white hover:!bg-blue-500 hover:!border-blue-500"
              onClick={() => navigate("/payment/upload")}
            >
              Upload
            </Button>
          ) : (
            <>
              <Button
                size="small"
                className="!border-blue-500 !text-blue-500 hover:!text-white hover:!bg-blue-500 hover:!border-blue-500"
                onClick={() => navigate("/payment/edit")}
              >
                Edit
              </Button>

              <Button
                size="small"
                className="!border-blue-500 !text-blue-500 hover:!text-white hover:!bg-blue-500 hover:!border-blue-500"
              >
                Download
              </Button>
            </>
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
          dataSource={data}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </div>
    </div>
  );
}

export default Payment;