import React, { useState, useEffect } from "react";
import { Table, Button, Card, Row, Col, Modal, Form, InputNumber, Input, DatePicker, Space, Popconfirm, message, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ToolOutlined, DollarOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import useAppStore from "../store/useAppStore";
import api from "../services/api";
import dayjs from "dayjs";

function Maintenance() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const selectedBranch = useAppStore((state) => state.selectedBranch);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  
  const [form] = Form.useForm();

  const formatRupiah = (number) => {
    if (!number) return "Rp 0";
    return "Rp " + Number(number).toLocaleString("id-ID");
  };

  useEffect(() => {
    if (!selectedBranch) {
      navigate("/branch");
    } else {
      fetchMaintenances();
    }
  }, [selectedBranch?.id, navigate]);

  const fetchMaintenances = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/maintenances?branch_id=${selectedBranch.id}`);
      // The backend returns the list directly or under data property
      const rawData = res.data ? res.data : res;
      setData(
        rawData.map((item) => ({
          ...item,
          key: item.id,
        }))
      );
    } catch (error) {
      console.error(error);
      message.error("Gagal mengambil data maintenance");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({
      date: dayjs(),
      electricBills: 0,
      operationalBills: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      date: dayjs(record.date),
      electricBills: Number(record.electricBills),
      operationalBills: Number(record.operationalBills),
      notes: record.notes,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/maintenances/${id}`);
      message.success("Catatan maintenance berhasil dihapus");
      fetchMaintenances();
    } catch (error) {
      console.error(error);
      message.error("Gagal menghapus catatan maintenance");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async (values) => {
    try {
      const payload = {
        branchId: selectedBranch.id,
        electricBills: values.electricBills || 0,
        operationalBills: values.operationalBills || 0,
        date: values.date.format("YYYY-MM-DD"),
        notes: values.notes || "",
      };

      if (editingRecord) {
        await api.patch(`/maintenances/${editingRecord.id}`, payload);
        message.success("Catatan maintenance berhasil diperbarui");
      } else {
        await api.post("/maintenances", payload);
        message.success("Catatan maintenance baru berhasil ditambahkan");
      }
      
      setIsModalOpen(false);
      fetchMaintenances();
    } catch (error) {
      console.error(error);
      message.error(editingRecord ? "Gagal memperbarui data" : "Gagal menambahkan data baru");
    }
  };

  // Calculate statistics
  const totalElectric = data.reduce((sum, item) => sum + Number(item.electricBills || 0), 0);
  const totalOperational = data.reduce((sum, item) => sum + Number(item.operationalBills || 0), 0);
  const totalAll = totalElectric + totalOperational;

  const columns = [
    {
      title: "Tanggal",
      dataIndex: "date",
      key: "date",
      render: (text) => dayjs(text).format("DD MMM YYYY"),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: "Biaya Listrik",
      dataIndex: "electricBills",
      key: "electricBills",
      render: (val) => formatRupiah(val),
    },
    {
      title: "Biaya Operasional",
      dataIndex: "operationalBills",
      key: "operationalBills",
      render: (val) => formatRupiah(val),
    },
    {
      title: "Total Pengeluaran",
      key: "total",
      render: (_, record) => {
        const total = Number(record.electricBills || 0) + Number(record.operationalBills || 0);
        return <span className="font-bold">{formatRupiah(total)}</span>;
      },
    },
    {
      title: "Catatan / Keterangan",
      dataIndex: "notes",
      key: "notes",
      render: (text) => text || "-",
    },
    {
      title: "Aksi",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
            className="!border-blue-500 !text-blue-500 hover:!bg-blue-500 hover:!text-white"
          >
            Edit
          </Button>
          <Popconfirm
            title="Hapus catatan?"
            description="Apakah Anda yakin ingin menghapus catatan pengeluaran ini?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya"
            cancelText="Tidak"
            okButtonProps={{ danger: true }}
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              className="hover:!bg-red-500 hover:!text-white"
            >
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky z-50 bg-gray-100 -mt-6 -mx-6 px-6 pt-6 pb-4 mb-2" style={{ top: "0px" }}>
        <Header title="Maintenance & Bills" username={user?.ownerProfile?.name || user?.email} />
      </div>

      <div className="px-1 pb-10">
        {/* STATS CARDS */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <Card className="rounded-2xl shadow-sm border-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Pengeluaran</div>
                  <div className="text-2xl font-bold text-gray-800 mt-1">{formatRupiah(totalAll)}</div>
                </div>
                <div className="p-3 bg-red-50 rounded-2xl flex items-center justify-center">
                  <DollarOutlined style={{ fontSize: "24px", color: "#ef4444" }} />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="rounded-2xl shadow-sm border-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Biaya Listrik</div>
                  <div className="text-2xl font-bold text-gray-800 mt-1">{formatRupiah(totalElectric)}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <ToolOutlined style={{ fontSize: "24px", color: "#3b82f6" }} />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="rounded-2xl shadow-sm border-0 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Biaya Operasional</div>
                  <div className="text-2xl font-bold text-gray-800 mt-1">{formatRupiah(totalOperational)}</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <InfoCircleOutlined style={{ fontSize: "24px", color: "#f97316" }} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* DATA TABLE CARD */}
        <Card
          className="rounded-2xl shadow-sm border-0"
          title={<span className="text-lg font-bold text-gray-800">Daftar Pengeluaran Cabang</span>}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenAdd}
              className="bg-[#1B59F8] hover:bg-blue-600 border-none rounded-xl"
            >
              Tambah Pengeluaran
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </Card>
      </div>

      {/* ADD/EDIT MODAL */}
      <Modal
        title={editingRecord ? "Edit Catatan Pengeluaran" : "Tambah Catatan Pengeluaran"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
        className="rounded-2xl"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="mt-4"
        >
          <Form.Item
            name="date"
            label="Tanggal Pengeluaran"
            rules={[{ required: true, message: "Silakan pilih tanggal" }]}
          >
            <DatePicker className="w-full" format="DD MMMM YYYY" />
          </Form.Item>

          <Form.Item
            name="electricBills"
            label="Biaya Listrik"
            rules={[{ required: true, message: "Silakan masukkan biaya listrik" }]}
          >
            <InputNumber
              className="w-full"
              min={0}
              formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\Rp\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="operationalBills"
            label="Biaya Operasional"
            rules={[{ required: true, message: "Silakan masukkan biaya operasional" }]}
          >
            <InputNumber
              className="w-full"
              min={0}
              formatter={(value) => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\Rp\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Keterangan / Catatan"
          >
            <Input.TextArea rows={3} placeholder="Contoh: Perbaikan AC kamar 10, Token listrik Juni 2026, dll." />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end gap-2">
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Batal</Button>
              <Button type="primary" htmlType="submit" className="bg-[#1B59F8] hover:bg-blue-600 border-none">
                Simpan
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Maintenance;
