// src/pages/Users.jsx
import { useNavigate } from 'react-router-dom';
import { Input, Button, Table, Tag } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { useState } from 'react';

function Users() {
  const username = "Manto Ariyansyah";
  const navigate = useNavigate();

  const [data, setData] = useState([
    { key: 1, room: "1", name: "Andi Saputra", gender: "Laki-laki", whatsapp: "08123456789", emergency: "08198765432", berkas: "Lengkap" },
    { key: 2, room: "2", name: "Siti Aminah", gender: "Perempuan", whatsapp: "08122334455", emergency: "08155667788", berkas: "Belum Lengkap" },
    { key: 3, room: "3", name: "Budi Santoso", gender: "Laki-laki", whatsapp: "08134567890", emergency: "08198765431", berkas: "Lengkap" },
    { key: 4, room: "4", name: "Dewi Lestari", gender: "Perempuan", whatsapp: "08133445566", emergency: "08155667789", berkas: "Belum Lengkap" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDeleteClick = (record) => {
    setSelectedUser(record);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setData(prev => prev.filter(item => item.key !== selectedUser.key));
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const columns = [
    // ✅ NO ROOM (SEBELUM NAMA)
    {
      title: "No",
      dataIndex: "room",
      key: "room",
      align: "left",
    },

    {
      title: "Nama Customer",
      dataIndex: "name",
      key: "name",
      align: "left",
    },
    {
      title: "Jenis Kelamin",
      dataIndex: "gender",
      key: "gender",
      align: "center",
    },
    {
      title: "No WhatsApp",
      dataIndex: "whatsapp",
      key: "whatsapp",
      align: "center",
    },
    {
      title: "No Darurat",
      dataIndex: "emergency",
      key: "emergency",
      align: "center",
    },
    {
      title: "Berkas",
      dataIndex: "berkas",
      key: "berkas",
      align: "center",
      render: (text) => (
        <Tag color={text === "Lengkap" ? "green" : "red"}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Aksi",
      key: "aksi",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-2">

          {/* HAPUS */}
          <Button
            size="small"
            className="!border-red-500 !text-red-500 hover:!text-white hover:!bg-red-500 hover:!border-red-500"
            onClick={() => handleDeleteClick(record)}
          >
            Hapus
          </Button>

          {/* EDIT */}
          <Button
            size="small"
            className="!border-blue-500 !text-blue-500 hover:!text-white hover:!bg-blue-500 hover:!border-blue-500"
            onClick={() => navigate("/cust/edit", { state: { record } })}
          >
            Edit
          </Button>

        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div
        className="sticky z-50 bg-gray-100 -mt-6 -mx-6 px-6 pt-6 pb-4 mb-2"
        style={{ top: '0px' }}
      >
        <Header title="Customer" username={username} />

        <div className="w-full md:w-96 max-w-md mt-4">
          <Input placeholder="Cari Nama Customer" prefix={<SearchOutlined />} />
        </div>
      </div>

      {/* CARD */}
      <div className="w-full mx-auto bg-white shadow-lg rounded-xl p-4 md:p-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2">
          <h2 className="text-md md:text-lg font-semibold">Customer List</h2>

          <div className='pr-6'>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/cust/add')}
            >
              Tambah
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-200 mb-2"></div>

        {/* TABLE */}
        <div className="overflow-x-auto md:overflow-visible">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            size="middle"
            bordered={false}
            rowClassName={() => "border-b border-gray-200"}
            scroll={{ x: 700 }}
          />
        </div>

      </div>

      {/* MODAL */}
      <ConfirmDeleteModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Anda Yakin Ingin Hapus Customer?"
        description="Customer yang kamu hapus tidak dapat dikembalikan. Apakah kamu yakin ingin melanjutkan?"
      />
    </div>
  );
}

export default Users;