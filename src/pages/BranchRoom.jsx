// src/pages/BranchRoom.jsx
import {
  Input,
  Button,
  Table,
  Space,
  Tag,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function BranchRoom() {
  const username = "Manto Ariyansyah";
  const navigate = useNavigate();

  // 💡 format rupiah
  const formatRupiah = (number) => {
    if (!number) return "-";
    return "Rp " + number.toLocaleString("id-ID");
  };

 const [data] = useState([
  { key: 1, room: "A1", name: "Manto Ariyansyah", gender: "Laki-laki", date: "22/5/2025", rent: "Mingguan", price: 500000, status: "Terisi" },
  { key: 2, room: "A2", name: "-", gender: "-", date: "-", rent: "-", price: 0, status: "Belum Terisi" },
  { key: 3, room: "A3", name: "Budi Santoso", gender: "Laki-laki", date: "21/5/2025", rent: "Bulanan", price: 1500000, status: "Terisi" },
  { key: 4, room: "A4", name: "Siti Aminah", gender: "Perempuan", date: "20/5/2025", rent: "Tahunan", price: 10000000, status: "Terisi" },
  { key: 5, room: "A5", name: "-", gender: "-", date: "-", rent: "-", price: 0, status: "Belum Terisi" },
  { key: 6, room: "A6", name: "Dewi Lestari", gender: "Perempuan", date: "18/5/2025", rent: "Bulanan", price: 1200000, status: "Terisi" },
  { key: 7, room: "A7", name: "Eko Prasetyo", gender: "Laki-laki", date: "17/5/2025", rent: "Mingguan", price: 600000, status: "Terisi" },
  { key: 8, room: "A8", name: "-", gender: "-", date: "-", rent: "-", price: 0, status: "Belum Terisi" },
  { key: 9, room: "A9", name: "Fitria Rahma", gender: "Perempuan", date: "16/5/2025", rent: "Bulanan", price: 1300000, status: "Terisi" },
  { key: 10, room: "A10", name: "Gilang Ramadhan", gender: "Laki-laki", date: "15/5/2025", rent: "Tahunan", price: 11000000, status: "Terisi" },
  { key: 11, room: "A11", name: "-", gender: "-", date: "-", rent: "-", price: 0, status: "Belum Terisi" },
  { key: 12, room: "A12", name: "Hani Kusuma", gender: "Perempuan", date: "14/5/2025", rent: "Mingguan", price: 550000, status: "Terisi" },
  { key: 13, room: "A13", name: "Irwan Maulana", gender: "Laki-laki", date: "13/5/2025", rent: "Bulanan", price: 1400000, status: "Terisi" },
  { key: 14, room: "A14", name: "-", gender: "-", date: "-", rent: "-", price: 0, status: "Belum Terisi" },
  { key: 15, room: "A15", name: "Julianti Sari", gender: "Perempuan", date: "12/5/2025", rent: "Tahunan", price: 10500000, status: "Terisi" },
]);

  const columns = [
    { title: "No Room", dataIndex: "room", key: "room" },
    { title: "Nama Customer", dataIndex: "name", key: "name" },
    { title: "Jenis Kelamin", dataIndex: "gender", key: "gender" },

    // ✅ TANGGAL MASUK (tetap)
    { title: "Tanggal Masuk", dataIndex: "date", key: "date" },

    // ✅ SEWA (Mingguan/Bulanan/Tahunan)
    {
      title: "Sewa",
      dataIndex: "rent",
      key: "rent",
      render: (text) => (
        <span>{text}</span>
      ),
    },

    // ✅ BIAYA ROOM (RUPIAH)
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

    // STATUS
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text) => (
        <Tag color={text === "Terisi" ? "green" : "red"}>
          {text}
        </Tag>
      ),
    },

    // AKSI
    {
      title: "Aksi",
      key: "aksi",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="small"
            className="!border-blue-500 !text-blue-500 hover:!text-white hover:!bg-blue-500 hover:!border-blue-500"
            onClick={() => navigate("/room/edit", { state: { record } })}
          >
            Edit
          </Button>

          <Button
            size="small"
            className="!border-blue-500 !text-blue-500 hover:!text-white hover:!bg-blue-500 hover:!border-blue-500"
            onClick={() => navigate("/room/isi", { state: { record } })}
          >
            Room
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div
        className="sticky z-50 bg-gray-100 -mt-6 -mx-6 px-6 pt-6 pb-4 mb-2"
        style={{ top: "0px" }}
      >
        <Header title="Room" username={username} />

        <div className="w-full md:w-96 max-w-md flex items-center gap-2 mt-4">
          <Input
            placeholder="Cari Nama Customer"
            prefix={<SearchOutlined />}
            className="flex-1"
          />
        </div>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden md:p-6 p-4">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
          <h2 className="text-lg font-semibold">Room</h2>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/room/add")}
          >
            Tambah
          </Button>
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

export default BranchRoom;