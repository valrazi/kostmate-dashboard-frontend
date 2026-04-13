import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, Row, Col, Table, DatePicker, Button, Typography, Space, Tag } from 'antd';
import { DownloadOutlined, UserOutlined, SwapOutlined, DollarOutlined } from '@ant-design/icons';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const { Title, Text } = Typography;

// ================= DATA =================

const customerTableData = [
    { key: '1', no: 1, nama: 'Budi Santoso', jk: 'Laki-laki', wa: '081234567890', darurat: '089999999999', status: 'Aktif' },
    { key: '2', no: 2, nama: 'Siti Aminah', jk: 'Perempuan', wa: '082345678901', darurat: '088888888888', status: 'Nonaktif' },
    { key: '3', no: 3, nama: 'Andi Wijaya', jk: 'Laki-laki', wa: '083456789012', darurat: '087777777777', status: 'Aktif' },
];

const incomeTableData = [
    { key: '1', room: '101', nama: 'Budi Santoso', bayarKe: 1, tanggal: '2023-01-10', biaya: 1500000, status: 'Lunas' },
    { key: '2', room: '102', nama: 'Andi Wijaya', bayarKe: 2, tanggal: '2023-03-20', biaya: 2000000, status: 'Lunas' },
    { key: '3', room: '103', nama: 'Siti Aminah', bayarKe: 1, tanggal: '2023-04-05', biaya: 1000000, status: 'Pending' },
];

const inOutTableData = [
    { key: '1', id: 'T001', name: 'Budi Santoso', action: 'In', date: '2023-01-10' },
    { key: '2', id: 'T002', name: 'Siti Aminah', action: 'Out', date: '2023-02-15' },
    { key: '3', id: 'T003', name: 'Andi Wijaya', action: 'In', date: '2023-03-20' },
];

// ================= CHART =================

const customerChartData = [
    { name: 'Jan', active: 40, inactive: 24 },
    { name: 'Feb', active: 30, inactive: 13 },
    { name: 'Mar', active: 20, inactive: 98 },
    { name: 'Apr', active: 27, inactive: 39 },
    { name: 'May', active: 18, inactive: 48 },
    { name: 'Jun', active: 23, inactive: 38 },
];

const inOutChartData = [
    { name: 'Jan', in: 10, out: 5 },
    { name: 'Feb', in: 15, out: 8 },
    { name: 'Mar', in: 8, out: 12 },
    { name: 'Apr', in: 20, out: 4 },
    { name: 'May', in: 12, out: 10 },
    { name: 'Jun', in: 25, out: 15 },
];

const incomeChartData = [
    { name: 'Jan', income: 4000 },
    { name: 'Feb', income: 3000 },
    { name: 'Mar', income: 2000 },
    { name: 'Apr', income: 2780 },
    { name: 'May', income: 1890 },
    { name: 'Jun', income: 2390 },
];

// helper
const formatRupiah = (val) =>
    "Rp " + val.toLocaleString("id-ID");

// ================= MAIN =================

function Report() {
    const username = "Manto Ariyansyah";
    const [activeTab, setActiveTab] = useState('customer');

    // ===== CUSTOMER SUMMARY =====
    const totalCustomer = customerTableData.length;
    const totalAktif = customerTableData.filter(c => c.status === 'Aktif').length;
    const totalNonaktif = customerTableData.filter(c => c.status === 'Nonaktif').length;

    // ===== INCOME SUMMARY =====
    const totalPendapatan = incomeTableData.filter(i => i.status === 'Lunas')
        .reduce((a, b) => a + b.biaya, 0);

    const totalPending = incomeTableData.filter(i => i.status === 'Pending')
        .reduce((a, b) => a + b.biaya, 0);

    const totalBiaya = incomeTableData.reduce((a, b) => a + b.biaya, 0);

    const getTableColumns = () => {
        if (activeTab === 'customer') {
            return [
                { title: 'No', dataIndex: 'no' },
                { title: 'Nama Customer', dataIndex: 'nama' },
                { title: 'Jenis Kelamin', dataIndex: 'jk' },
                { title: 'No WhatsApp', dataIndex: 'wa' },
                { title: 'No Darurat', dataIndex: 'darurat' },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    render: (s) => <Tag color={s === 'Aktif' ? 'green' : 'red'}>{s}</Tag>
                },
            ];
        }

        if (activeTab === 'income') {
            return [
                { title: 'No Room', dataIndex: 'room' },
                { title: 'Nama Customer', dataIndex: 'nama' },
                { title: 'Pembayaran Ke-', dataIndex: 'bayarKe' },
                { title: 'Tanggal Pembayaran', dataIndex: 'tanggal' },
                {
                    title: 'Biaya Room',
                    dataIndex: 'biaya',
                    render: (v) => formatRupiah(v)
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    render: (s) => <Tag color={s === 'Lunas' ? 'green' : 'orange'}>{s}</Tag>
                },
            ];
        }

        return [
            { title: 'ID', dataIndex: 'id' },
            { title: 'Name', dataIndex: 'name' },
            { title: 'Action', dataIndex: 'action' },
            { title: 'Date', dataIndex: 'date' },
        ];
    };

    const getTableData = () => {
        if (activeTab === 'customer') return customerTableData;
        if (activeTab === 'income') return incomeTableData;
        return inOutTableData;
    };

    const renderChart = () => {
        if (activeTab === 'customer') {
            return (
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={customerChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line dataKey="active" stroke="#8884d8" />
                        <Line dataKey="inactive" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            );
        }

        if (activeTab === 'income') {
            return (
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={incomeChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line dataKey="income" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            );
        }

        return (
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={inOutChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="in" fill="#8884d8" />
                    <Bar dataKey="out" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">

            <div
                className="sticky z-50 bg-gray-100 -mt-2 -mx-6 px-6 pt-2 pb-2 mb-2"
                style={{ top: '0px' }}
            >
                {/* HEADER */}
                <Header title="Reports" username={username} />

            </div>


            <div className="p-">

                {/* ✅ MENU DENGAN GARIS */}
                <div className="mb-4">
                    <div className="flex w-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-md">

                        {[
                            { key: 'customer', icon: <UserOutlined />, label: 'Customer' },
                            { key: 'inout', icon: <SwapOutlined />, label: 'Keluar Masuk' },
                            { key: 'income', icon: <DollarOutlined />, label: 'Pemasukan' },
                        ].map((item, index) => (

                            <div
                                key={item.key}
                                onClick={() => setActiveTab(item.key)}
                                className={`
                                        flex-1 flex items-center justify-center gap-2
                                        py-2 cursor-pointer text-sm sm:text-base
                                        transition-all duration-300

                                        ${activeTab === item.key
                                        ? 'bg-blue-50 text-blue-600 font-semibold'
                                        : 'text-gray-500 hover:bg-gray-50'}
                                        `}
                                style={{
                                    borderRight: index !== 2 ? '1px solid #DBDCDE' : 'none'
                                }}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </div>

                        ))}

                    </div>
                </div>

                {/* ✅ SUMMARY */}
                {activeTab === 'customer' && (
                    <Row gutter={[12, 12]} className="mt-4 mb-4">
                        <Col xs={24} md={8}>
                            <Card size="small" className="shadow-md" style={{ borderRadius: 15 }}>
                                <Text>Total Customer</Text>
                                <Title level={4}>{totalCustomer}</Title>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card size="small" className="shadow-md" style={{ borderRadius: 15 }}>
                                <Text>Aktif</Text>
                                <Title level={4} className="!text-green-600">{totalAktif}</Title>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card size="small" className="shadow-md" style={{ borderRadius: 15 }}>
                                <Text>Nonaktif</Text>
                                <Title level={4} className="!text-red-500">{totalNonaktif}</Title>
                            </Card>
                        </Col>
                    </Row>
                )}

                {activeTab === 'income' && (
                    <Row gutter={[12, 12]} className="mt-4 mb-4">
                        <Col xs={24} md={8}>
                            <Card size="small" className="shadow-md" style={{ borderRadius: 15 }}>
                                <Text>Total Pendapatan</Text>
                                <Title level={4}>{formatRupiah(totalPendapatan)}</Title>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card size="small" className="shadow-md" style={{ borderRadius: 15 }}>
                                <Text>Total Biaya</Text>
                                <Title level={4}>{formatRupiah(totalBiaya)}</Title>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card size="small" className="shadow-md" style={{ borderRadius: 15 }}>
                                <Text>Pending</Text>
                                <Title level={4} className="!text-orange-500">{formatRupiah(totalPending)}</Title>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* CONTENT */}
                <Card style={{ borderRadius: 15 }} className="shadow-md"
                    title="Report View"
                    extra={
                        <Space>
                            <DatePicker picker="month" />
                            <Button icon={<DownloadOutlined />} type="primary">Download</Button>
                        </Space>
                    }
                >
                    {renderChart()}

                    <Table
                        className="mt-4"
                        columns={getTableColumns()}
                        dataSource={getTableData()}
                        pagination={{ pageSize: 5 }}
                    />
                </Card>

            </div>
        </div>
    );
}

export default Report;