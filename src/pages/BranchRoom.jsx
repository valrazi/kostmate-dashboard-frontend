import { Input, Button, Table, Space, Tag, message } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAppStore from "../store/useAppStore";
import api from "../services/api";

function BranchRoom() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const selectedBranch = useAppStore((state) => state.selectedBranch);
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const formatRupiah = (number) => {
    if (!number) return "-";
    return "Rp " + Number(number).toLocaleString("id-ID");
  };

  useEffect(() => {
    if (!selectedBranch) {
      navigate('/branch');
    } else {
      fetchRooms();
    }
  }, [selectedBranch]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/rooms?branch_id=${selectedBranch.id}`);
      
      const rawData = res.data.data ? res.data.data : res.data;
      
      const mappedData = rawData.map((room) => {
        const activeRental = room.rentals && room.rentals.length > 0 ? room.rentals[0] : null;
        
        return {
          ...room,
          key: room.id,
          roomNumber: room.roomNumber,
          name: activeRental?.customer?.name || "-",
          gender: room.gender === "male" ? "Laki-laki" : room?.gender === "female" ? "Perempuan" : "-",
          date: activeRental?.startDate ? new Date(activeRental.startDate).toLocaleDateString("id-ID") : "-",
          rent: activeRental?.rentType === "daily" ? "Harian" : activeRental?.rentType === "weekly" ? "Mingguan" : activeRental?.rentType === "monthly" ? "Bulanan" : activeRental?.rentType === "yearly" ? "Tahunan" : "-",
          price: activeRental?.monthlyPrice || 0,
          status: room.status === "available" ? "Belum Terisi" : room.status === "filled" ? "Terisi" : "Maintenance",
        };
      });

      setData(mappedData);
    } catch (error) {
      console.error(error);
      message.error("Gagal mengambil data room");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) => 
    item.roomNumber.toLowerCase().includes(searchText.toLowerCase()) ||
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "No Room", dataIndex: "roomNumber", key: "roomNumber" },
    { title: "Nama Customer", dataIndex: "name", key: "name" },
    { title: "Jenis Kelamin", dataIndex: "gender", key: "gender" },
    { title: "Tanggal Masuk", dataIndex: "date", key: "date" },
    {
      title: "Sewa",
      dataIndex: "rent",
      key: "rent",
      render: (text) => <span>{text}</span>,
    },
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
      align: "center",
      render: (text) => (
        <Tag color={text === "Terisi" ? "green" : text === "Maintenance" ? "orange" : "red"}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Aksi",
      key: "aksi",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          {record.status !== "Terisi" && (
            <Button
              size="small"
              className="!border-blue-500 !text-blue-500 hover:!text-white hover:!bg-blue-500 hover:!border-blue-500"
              onClick={() => navigate("/room/edit", { state: { record } })}
            >
              Edit
            </Button>
          )}

          <Button
            size="small"
            className="!border-blue-500 !text-blue-500 hover:!text-white hover:!bg-blue-500 hover:!border-blue-500"
            onClick={() => navigate(`/room/isi?roomId=${record.id}`)}
          >
            Room
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div
        className="sticky z-50 bg-gray-100 -mt-6 -mx-6 px-6 pt-6 pb-4 mb-2"
        style={{ top: "0px" }}
      >
        <Header title="Room" username={user?.ownerProfile?.name || user?.email} />

        <div className="w-full md:w-96 max-w-md flex items-center gap-2 mt-4">
          <Input
            placeholder="Cari No Room atau Nama Customer"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden md:p-6 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
          <h2 className="text-lg font-semibold">Room Lists</h2>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/room/add")}
          >
            Tambah
          </Button>
        </div>

        <div className="border-t border-gray-200 mb-2" />

        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </div>
    </div>
  );
}

export default BranchRoom;