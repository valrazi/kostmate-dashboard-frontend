// src/pages/Users.jsx
import { useNavigate } from 'react-router-dom';
import { Input, Button, Table, Tag } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import { useState } from 'react';

function Users() {
  const username = "Manto Ariyansyah";
  const navigate = useNavigate();

  const [data] = useState([
    { key: 1, name: "Andi Saputra", gender: "Laki-laki", whatsapp: "08123456789", emergency: "08198765432", berkas: "Lengkap" },
    { key: 2, name: "Siti Aminah", gender: "Perempuan", whatsapp: "08122334455", emergency: "08155667788", berkas: "Belum Lengkap" },
    { key: 3, name: "Budi Santoso", gender: "Laki-laki", whatsapp: "08134567890", emergency: "08198765431", berkas: "Lengkap" },
    { key: 4, name: "Dewi Lestari", gender: "Perempuan", whatsapp: "08133445566", emergency: "08155667789", berkas: "Belum Lengkap" },
    { key: 5, name: "Eko Prasetyo", gender: "Laki-laki", whatsapp: "08145678901", emergency: "08198765433", berkas: "Lengkap" },
    { key: 6, name: "Fitria Rahma", gender: "Perempuan", whatsapp: "08144556677", emergency: "08155667790", berkas: "Belum Lengkap" },
    { key: 7, name: "Gilang Ramadhan", gender: "Laki-laki", whatsapp: "08156789012", emergency: "08198765434", berkas: "Lengkap" },
    { key: 8, name: "Hani Kusuma", gender: "Perempuan", whatsapp: "08155667788", emergency: "08155667791", berkas: "Belum Lengkap" },
    { key: 9, name: "Irwan Maulana", gender: "Laki-laki", whatsapp: "08167890123", emergency: "08198765435", berkas: "Lengkap" },
    { key: 10, name: "Julianti Sari", gender: "Perempuan", whatsapp: "08166778899", emergency: "08155667792", berkas: "Belum Lengkap" },
  ]);

  const columns = [
    {
      title: "Nama Penghuni",
      dataIndex: "name",
      key: "name",
      align: "left",
    },
    {
      title: "Gender",
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
        <Button
          size="small"
          type="primary"
          onClick={() => navigate("/cust/edit", { state: { record } })}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div 
        className="sticky z-50 bg-gray-100 -mt-6 -mx-6 px-6 pt-6 pb-4 mb-2"
        style={{ top: '0px' }}
      >
        <Header title="Customer" username={username} />

        {/* SEARCH */}
        <div className="w-full md:w-80 max-w-md mt-4">
          <Input placeholder="Cari Nama Customer" prefix={<SearchOutlined />} />
        </div>
      </div>

      {/* CARD */}
      <div className="w-full mx-auto bg-white shadow-lg rounded-xl p-4 md:p-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2">
          <div>
            <h2 className="text-md md:text-lg font-semibold">Customer List</h2>
            <p className="text-xs md:text-sm text-gray-500">
              Our most popular plan for small teams.
            </p>
          </div>

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

        {/* GARIS */}
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
    </div>
  );
}

export default Users;