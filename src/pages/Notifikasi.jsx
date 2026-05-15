import React, { useState } from 'react';
import { useEffect } from 'react';
import Header from '../components/Header';
import { Card, Table, Button, Tag, Space, Typography, Tooltip, message, Modal } from 'antd';
import { WhatsAppOutlined, SendOutlined, InfoCircleOutlined, SyncOutlined } from '@ant-design/icons';
import api from '../services/api';
import useAppStore from '../store/useAppStore';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

function Notifikasi() {
  const { user, selectedBranch } = useAppStore();
  const username = user?.name || "Admin";
  const [loading, setLoading] = useState(false);
  const [dataQueue, setDataQueue] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const fetchWhatsappQueue = async () => {
    if (!selectedBranch?.id) return;
    setLoading(true);
    try {
      const response = await api.get(`/whatsapp-queue?branch_id=${selectedBranch.id}`);
      // Asumsi response adalah array
      setDataQueue(Array.isArray(response.data) ? response.data : []);
      console.log(response.data)
    } catch (error) {
      console.error('Failed to fetch whatsapp queue:', error);
      message.error('Gagal mengambil data antrean WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhatsappQueue();
  }, [selectedBranch]);

  // Simulasi kirim pesan WA satu per satu
  const handleSendWA = (record) => {
    const waUrl = `https://wa.me/${record.customerWhatsappNumber}?text=${encodeURIComponent(record.messageText)}`;
    window.open(waUrl, '_blank');
    message.success(`Membuka WhatsApp untuk ${record.customer?.name || 'Pelanggan'}`);
  };

  // Simulasi Broadcast Pesan Otomatis melalui Sistem
  const handleBroadcast = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Pilih minimal satu penghuni untuk di broadcast');
      return;
    }

    Modal.confirm({
      title: 'Konfirmasi Broadcast WhatsApp',
      content: `Anda yakin ingin mengirim pesan pengingat ke ${selectedRowKeys.length} penghuni terpilih secara otomatis melalui sistem?`,
      okText: 'Kirim Sekarang',
      cancelText: 'Batal',
      onOk: () => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          message.success(`${selectedRowKeys.length} pesan broadcast berhasil dikirim masuk ke antrean server!`);
          setSelectedRowKeys([]);
        }, 1500);
      }
    });
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('DD MMM YYYY, HH:mm'),
    },
    {
      title: 'Nama Penghuni',
      key: 'nama',
      render: (_, record) => record.customer?.name || '-',
    },
    {
      title: 'No WhatsApp',
      dataIndex: 'customerWhatsappNumber',
      key: 'noWA',
    },
    {
      title: 'Pesan',
      dataIndex: 'messageText',
      key: 'message',
      render: (text) => (
        <Tooltip title={text}>
          <div style={{ maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'statusSent',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'sent') color = 'green';
        else if (status === 'pending') color = 'orange';
        else if (status === 'failed') color = 'red';
        return <Tag color={color}>{status?.toUpperCase() || 'UNKNOWN'}</Tag>;
      }
    },
    // {
    //   title: 'Aksi',
    //   key: 'action',
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Tooltip title="Kirim WA Manual">
    //         <Button
    //           type="primary"
    //           ghost
    //           icon={<WhatsAppOutlined />}
    //           onClick={() => handleSendWA(record)}
    //         />
    //       </Tooltip>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div
        className="sticky z-50 bg-gray-100 -mt-2 -mx-6 px-6 pt-2 pb-2 mb-2"
        style={{ top: '0px' }}
      >
        <Header title="Notifikasi" username={username} />
      </div>

      <div className="p-4 sm:p-6 lg:p-0">

        {/* Banner Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-4">
          <InfoCircleOutlined className="text-blue-500 text-2xl mt-1" />
          <div>
            <Title level={5} className="!text-blue-700 !m-0 mb-1">Sistem Pengingat Pembayaran Otomatis</Title>
            <Text className="text-blue-600">
              Menu Notifikasi ini digunakan untuk mengirimkan pesan pengingat tagihan kost via WhatsApp kepada penghuni.
              Sistem menampilkan daftar penghuni yang mendekati tanggal jatuh tempo. Anda dapat mengirim broadcast otomatis atau chat manual.
            </Text>
          </div>
        </div>

        <Card
          className="shadow-sm"
          style={{ borderRadius: 12 }}
          title={
            <div className="flex items-center justify-between">
              <span>Riwayat & Antrean Pesan WhatsApp</span>
              <Button icon={<SyncOutlined />} onClick={fetchWhatsappQueue} loading={loading}>
                Refresh
              </Button>
            </div>
          }
          // extra={
          //   <Button
          //     type="primary"
          //     className="bg-green-600 hover:bg-green-500"
          //     icon={<SendOutlined />}
          //     onClick={handleBroadcast}
          //     loading={loading}
          //     disabled={selectedRowKeys.length === 0}
          //   >
          //     Broadcast WA Terpilih ({selectedRowKeys.length})
          //   </Button>
          // }
        >
          <div className="overflow-x-auto">
            <Table
              // rowSelection={rowSelection}
              columns={columns}
              dataSource={dataQueue}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </div>
        </Card>

      </div>
    </div>
  );
}

export default Notifikasi;