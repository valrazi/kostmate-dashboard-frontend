// src/pages/Users.jsx
import { useNavigate } from 'react-router-dom';
import { Input, Button, Table, Tag, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import useAppStore from '../store/useAppStore';
import api from '../services/api';

function Users() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const selectedBranch = useAppStore((state) => state.selectedBranch);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    if (!selectedBranch) {
      navigate('/branch');
    } else {
      fetchCustomers();
    }
  }, [selectedBranch, debouncedSearch]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({ branch_id: selectedBranch.id });
      if (debouncedSearch) {
        queryParams.append("search", debouncedSearch);
      }
      const res = await api.get(`/customers?${queryParams.toString()}`);
      setData(res.data.data ? res.data.data : res.data);
    } catch (error) {
      console.error(error);
      message.error("Gagal mengambil data customer");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (record) => {
    setSelectedUser(record);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await api.delete(`/customers/${selectedUser.id}`);
      message.success("Customer berhasil dihapus");
      fetchCustomers();
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.meta?.error?.message
        || error.response?.data?.message
        || "Gagal menghapus branch";
      message.error(errorMessage);
    } finally {
      setIsModalOpen(false);
      setSelectedUser(null);
    }
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
      render: (text) => text === 'male' ? 'Laki-laki' : text === 'female' ? 'Perempuan' : text
    },
    {
      title: "No WhatsApp",
      dataIndex: "whatsappNumber",
      key: "whatsappNumber",
      align: "center",
    },
    {
      title: "No Darurat",
      dataIndex: "emergencyPhoneNumber",
      key: "emergencyPhoneNumber",
      align: "center",
    },
    {
      title: "Berkas",
      dataIndex: "identityUrl",
      key: "identityUrl",
      align: "center",
      render: (url) => (
        <Tag color={url ? "green" : "red"}>
          {url ? "Lengkap" : "Belum Lengkap"}
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
        <Header title="Customer" username={user?.ownerProfile?.name || user?.email} />

        <div className="w-full md:w-96 max-w-md mt-4">
          <Input 
            placeholder="Cari Nama Customer" 
            prefix={<SearchOutlined />} 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
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
            rowKey="id"
            loading={loading}
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