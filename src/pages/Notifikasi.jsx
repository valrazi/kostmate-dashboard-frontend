import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, Table, Button, Tag, Space, Typography, Tooltip, message, Modal } from 'antd';
import { WhatsAppOutlined, SendOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Mock Data
const datatMendekatiJatuhTempo = [
  { 
    key: '1', 
    nama: 'Budi Santoso', 
    kamar: '101', 
    jatuhTempo: '2026-04-15', 
    sisaHari: 2, 
    noWA: '081234567890',
    statusTagihan: 'Belum Lunas'
  },
  { 
    key: '2', 
    nama: 'Siti Aminah', 
    kamar: '102', 
    jatuhTempo: '2026-04-12', 
    sisaHari: -1, 
    noWA: '082345678901',
    statusTagihan: 'Menunggak'
  },
  { 
    key: '3', 
    nama: 'Andi Wijaya', 
    kamar: '103', 
    jatuhTempo: '2026-04-17', 
    sisaHari: 4, 
    noWA: '083456789012',
    statusTagihan: 'Belum Lunas'
  },
  { 
    key: '4', 
    nama: 'Rina Marlina', 
    kamar: '104', 
    jatuhTempo: '2026-04-20', 
    sisaHari: 7, 
    noWA: '084567890123',
    statusTagihan: 'Belum Lunas'
  },
];

function Notifikasi() {
  const username = "Manto Ariyansyah";
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Simulasi kirim pesan WA satu per satu
  const handleSendWA = (record) => {
    const text = `Halo ${record.nama}, kami dari Kostmate ingin mengingatkan bahwa tagihan sewa kamar ${record.kamar} Anda akan jatuh tempo pada tanggal ${record.jatuhTempo}. Mohon segera melakukan pembayaran. Terima kasih.`;
    const waUrl = `https://wa.me/${record.noWA}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    message.success(`Membuka WhatsApp untuk ${record.nama}`);
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
      title: 'Nama Penghuni',
      dataIndex: 'nama',
      key: 'nama',
    },
    {
      title: 'Kamar',
      dataIndex: 'kamar',
      key: 'kamar',
    },
    {
      title: 'No WhatsApp',
      dataIndex: 'noWA',
      key: 'noWA',
    },
    {
      title: 'Jatuh Tempo',
      dataIndex: 'jatuhTempo',
      key: 'jatuhTempo',
    },
    {
      title: 'Status',
      key: 'sisaHari',
      render: (_, record) => {
        if (record.sisaHari < 0) {
          return <Tag color="red">Terlewat {Math.abs(record.sisaHari)} Hari</Tag>;
        } else if (record.sisaHari <= 3) {
          return <Tag color="orange">Mendekati (Sisa {record.sisaHari} Hari)</Tag>;
        }
        return <Tag color="blue">Sisa {record.sisaHari} Hari</Tag>;
      }
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Kirim WA Manual">
            <Button 
              type="primary" 
              ghost 
              icon={<WhatsAppOutlined />} 
              onClick={() => handleSendWA(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
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
          title="Daftar Jatuh Tempo Pembayaran"
          extra={
            <Button 
              type="primary" 
              className="bg-green-600 hover:bg-green-500"
              icon={<SendOutlined />} 
              onClick={handleBroadcast}
              loading={loading}
              disabled={selectedRowKeys.length === 0}
            >
              Broadcast WA Terpilih ({selectedRowKeys.length})
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={datatMendekatiJatuhTempo}
              pagination={{ pageSize: 10 }}
            />
          </div>
        </Card>

      </div>
    </div>
  );
}

export default Notifikasi;