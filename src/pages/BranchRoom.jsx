import {
  Input,
  Button,
  Card,
  Avatar,
  Tooltip,
  Table,
  Space,
  Tag,
} from "antd";
import {
  SearchOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

function BranchRoom() {
  const username = "Manto Ariyansyah";
  const navigate = useNavigate();

  // Avatar dummy
  const users = [
    "https://randomuser.me/api/portraits/men/1.jpg",
    "https://randomuser.me/api/portraits/women/2.jpg",
    "https://randomuser.me/api/portraits/men/3.jpg",
    "https://randomuser.me/api/portraits/women/4.jpg",
    "https://randomuser.me/api/portraits/men/5.jpg",
    "https://randomuser.me/api/portraits/women/6.jpg",
  ];

  // Data tabel
  const data = [
    { key: 1, room: "A1", name: "Manto Ariyansyah", gender: "Laki - Laki", date: "22/5/2025", outDate: "22/5/2025", status: "Terisi" },
    { key: 2, room: "A2", name: "Manto Ariyansyah", gender: "Laki - Laki", date: "22/5/2025", outDate: "22/5/2025", status: "Terisi" },
    { key: 3, room: "A3", name: "Manto Ariyansyah", gender: "Laki - Laki", date: "22/5/2025", outDate: "22/5/2025", status: "Terisi" },
    { key: 4, room: "A4", name: "Manto Ariyansyah", gender: "Laki - Laki", date: "22/5/2025", outDate: "22/5/2025", status: "Terisi" },
    { key: 5, room: "A5", name: "Manto Ariyansyah", gender: "Laki - Laki", date: "22/5/2025", outDate: "22/5/2025", status: "Terisi" },
    { key: 6, room: "A6", name: "Manto Ariyansyah", gender: "Laki - Laki", date: "22/5/2025", outDate: "22/5/2025", status: "Terisi" },
    { key: 7, room: "A7", name: "Manto Ariyansyah", gender: "Laki - Laki", date: "22/5/2025", outDate: "22/5/2025", status: "Terisi" },
    { key: 8, room: "A8", name: "Manto Ariyansyah", gender: "Laki - Laki", date: "22/5/2025", outDate: "22/5/2025", status: "Terisi" },
    { key: 9, room: "A9", name: "Manto Ariyansyah", gender: "Laki - Laki", date: "22/5/2025", outDate: "22/5/2025", status: "Terisi" },
    { key: 10, room: "A10", name: "Manto Ariyansyah", gender: "Laki - Laki", date: "22/5/2025", outDate: "22/5/2025", status: "Terisi" },
  ];

  // Kolom tabel
  const columns = [
    { title: "No Room", dataIndex: "room", key: "room" },
    { title: "Nama Penghuni", dataIndex: "name", key: "name" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Tanggal Masuk", dataIndex: "date", key: "date" },
    { title: "Tanggal Keluar", dataIndex: "outDate", key: "outDate" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span className="text-gray-700">{text}</span>
      ),
    },
    {
      title: "Aksi",
      key: "aksi",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="small"
            type="default"
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
            onClick={() => navigate("/room/edit", { state: { record } })}
          >
            Edit
          </Button>
          <Button
            size="small"
            type="default"
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
            onClick={() => navigate("/room/isi", { state: { record } })}
          >
            Room
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <div
        className="sticky z-50 bg-gray-100 -mt-6 -mx-6 px-6 pt-6 pb-4 mb-2"
        style={{ top: '0px' }}
      >
        <Header title="Branch Room" username={username} />

        {/* Search */}
        <div className="w-full md:w-1/2 max-w-md flex items-center gap-2 mt-4">
          <Input
            placeholder="Cari Nama Customer"
            prefix={<SearchOutlined />}
            className="flex-1"
          />
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/branch')}
          >
            Kembali
          </Button>
        </div>
      </div>

      {/* Card */}
      <Card className="w-full md:w-100 shadow-lg rounded-xl relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Kiri */}
          <div className="flex-1 w-full">
            <h2 className="text-lg font-semibold">
              Kost Anugrah
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Our most popular plan for small teams.
            </p>

            <div className="flex -space-x-3 mt-3">
              {users.map((img, i) => (
                <Tooltip title={`User ${i + 1}`} key={i}>
                  <Avatar
                    size="large"
                    src={img}
                    className="border-2 border-white"
                  />
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Kanan */}
          <div className="flex items-center justify-center md:justify-end w-full md:w-auto">
            <div className="text-center md:text-right flex flex-col items-center md:items-end">
              <div>
                <span className="text-lg font-bold">27</span>
                <span className="text-sm text-gray-500">/80</span>
              </div>


            </div>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <Button size="small" type="primary" className="mt-2 w-16" onClick={() => navigate('/branch/room/edit')}>
            Edit
          </Button>
        </div>
      </Card>

      {/* Table Section */}
      <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
          <div>
            <h2 className="text-lg font-semibold">Room</h2>
            <p className="text-xs text-gray-500">
              Our most popular plan for small teams.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap pr-9">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/room/add')} // arahkan ke halaman lain
            >
              Tambah
            </Button>
          </div>
        </div>

        {/* Garis */}
        <div className="border-t border-gray-200" />

        {/* Table */}
        <div className="overflow-x-auto md:overflow-visible">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{ x: 700 }} // aktif saat mobile
          />
        </div>
      </div>
    </div>
  );
}

export default BranchRoom;
