import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import useAppStore from '../store/useAppStore';
import { Card, Row, Col, Table, DatePicker, Button, Typography, Space, Tag, Spin, message, Empty } from 'antd';
import { DownloadOutlined, UserOutlined, SwapOutlined, DollarOutlined, HomeOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const { Title, Text } = Typography;

// helper
const formatRupiah = (val) => {
    if (!val) return "Rp 0";
    return "Rp " + Number(val).toLocaleString("id-ID");
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const renderLegend = (value, entry) => {
    const val = entry?.payload?.value ?? 0;
    return <span style={{ color: '#374151', fontSize: '12px', fontWeight: '500' }}>{value} ({val} Orang)</span>;
};

// ================= MAIN =================

function Report() {
    const navigate = useNavigate();
    const user = useAppStore((state) => state.user);
    const selectedBranch = useAppStore((state) => state.selectedBranch);
    
    const username = user?.ownerProfile?.name || user?.name || user?.email || "Admin";
    const [activeTab, setActiveTab] = useState('income');
    const [selectedMonth, setSelectedMonth] = useState(null); // Dayjs object or null
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        if (!selectedBranch) {
            navigate('/branch');
            return;
        }

        const fetchReportData = async () => {
            try {
                setLoading(true);
                const monthParam = selectedMonth ? `&month=${selectedMonth.format('YYYY-MM')}` : '';
                const response = await api.get(`/reports?branch_id=${selectedBranch.id}${monthParam}`);
                setReportData(response.data);
            } catch (error) {
                console.error("Fetch report error:", error);
                message.error("Gagal memuat data laporan");
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, [selectedBranch?.id, selectedMonth, navigate]);

    if (loading || !reportData) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Spin size="large" tip="Memuat data laporan..." />
            </div>
        );
    }

    // ===== CUSTOMER SUMMARY =====
    const totalCustomer = reportData.customer.totalCustomers;
    const totalAktif = reportData.customer.totalAktif;
    const totalNonaktif = reportData.customer.totalNonaktif;

    // ===== ROOM SUMMARY =====
    const totalRooms = reportData.room.totalRooms;
    const roomsTersedia = reportData.room.roomsTersedia;
    const roomsTerisi = reportData.room.roomsTerisi;

    // ===== INCOME SUMMARY =====
    const totalPendapatan = reportData.income.totalRevenue;
    const totalPending = reportData.income.totalPending;
    const totalBiaya = reportData.income.totalBiaya;
    const totalMaintenance = reportData.income.totalMaintenance || 0;
    const netProfit = totalPendapatan - totalMaintenance;

    const handleDownload = () => {
        try {
            let csvContent = "";
            let fileName = "";
            
            if (activeTab === 'customer') {
                const headers = ["No", "Nama Customer", "Jenis Kelamin", "No WhatsApp", "No Darurat", "Status"];
                csvContent += headers.join(",") + "\n";
                
                reportData.customer.list.forEach(item => {
                    const row = [
                        item.no,
                        `"${item.nama.replace(/"/g, '""')}"`,
                        `"${item.jk}"`,
                        `"${item.wa}"`,
                        `"${item.darurat}"`,
                        `"${item.status}"`
                    ];
                    csvContent += row.join(",") + "\n";
                });
                fileName = `report_customer_${selectedBranch.name.toLowerCase().replace(/\s+/g, '_')}.csv`;
            } else if (activeTab === 'room') {
                const headers = ["No", "No Room", "Jenis Kelamin", "Status"];
                csvContent += headers.join(",") + "\n";
                
                reportData.room.list.forEach(item => {
                    const row = [
                        item.no,
                        `"${item.roomNumber}"`,
                        `"${item.gender}"`,
                        `"${item.status}"`
                    ];
                    csvContent += row.join(",") + "\n";
                });
                fileName = `report_kamar_${selectedBranch.name.toLowerCase().replace(/\s+/g, '_')}.csv`;
            } else if (activeTab === 'inout') {
                const headers = ["ID", "Name", "Action", "Date"];
                csvContent += headers.join(",") + "\n";
                
                reportData.inout.list.forEach(item => {
                    const row = [
                        `"${item.id}"`,
                        `"${item.name.replace(/"/g, '""')}"`,
                        `"${item.action}"`,
                        `"${item.date}"`
                    ];
                    csvContent += row.join(",") + "\n";
                });
                fileName = `report_keluarmasuk_${selectedBranch.name.toLowerCase().replace(/\s+/g, '_')}.csv`;
            } else if (activeTab === 'income') {
                const headers = ["No Room", "Nama Customer", "Pembayaran Ke", "Tanggal Pembayaran", "Biaya Room", "Status"];
                csvContent += headers.join(",") + "\n";
                
                reportData.income.list.forEach(item => {
                    const row = [
                        `"${item.room}"`,
                        `"${item.nama.replace(/"/g, '""')}"`,
                        item.bayarKe,
                        `"${item.tanggal}"`,
                        item.biaya,
                        `"${item.status}"`
                    ];
                    csvContent += row.join(",") + "\n";
                });
                fileName = `report_pemasukan_${selectedBranch.name.toLowerCase().replace(/\s+/g, '_')}.csv`;
            }

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            message.success(`Laporan ${activeTab === 'inout' ? 'keluar masuk' : activeTab === 'room' ? 'kamar' : activeTab} berhasil diunduh`);
        } catch (error) {
            console.error("Failed to download CSV", error);
            message.error("Gagal mengunduh laporan");
        }
    };

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

        if (activeTab === 'room') {
            return [
                { title: 'No', dataIndex: 'no' },
                { title: 'No Room', dataIndex: 'roomNumber' },
                { title: 'Jenis Kelamin', dataIndex: 'gender' },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    render: (s) => (
                        <Tag color={s === 'Terisi' ? 'blue' : s === 'Tersedia' ? 'green' : 'orange'}>
                            {s}
                        </Tag>
                    )
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
        if (activeTab === 'customer') return reportData.customer.list;
        if (activeTab === 'room') return reportData.room.list;
        if (activeTab === 'income') return reportData.income.list;
        return reportData.inout.list;
    };
    const renderChart = () => {
        if (activeTab === 'customer') {
            const genderData = [
                { name: 'Laki-laki', value: reportData.customer.list.filter(c => c.jk === 'Laki-laki').length },
                { name: 'Perempuan', value: reportData.customer.list.filter(c => c.jk === 'Perempuan').length },
            ].filter(item => item.value > 0);

            const COLORS = ['#3b82f6', '#ec4899'];

            return (
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} lg={15}>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reportData.customer.chart} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="active" fill="#8884d8" name="Aktif" />
                                    <Bar dataKey="inactive" fill="#82ca9d" name="Nonaktif" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Col>
                    <Col xs={24} lg={9}>
                        <div style={{ width: '100%', height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontWeight: '600', marginBottom: 10, color: '#374151' }}>Distribusi Jenis Kelamin</div>
                            {genderData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="90%">
                                    <PieChart>
                                        <Pie
                                            data={genderData}
                                            cx="40%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={70}
                                            dataKey="value"
                                        >
                                            {genderData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`${value} Orang`, 'Jumlah']} />
                                        <Legend layout="vertical" align="right" verticalAlign="middle" formatter={renderLegend} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Tidak ada data jenis kelamin" style={{ margin: '20px 0' }} />
                            )}
                        </div>
                    </Col>
                </Row>
            );
        }

        if (activeTab === 'room') {
            return (
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={reportData.room.chart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="filled" fill="#3b82f6" name="Terisi" />
                        <Bar dataKey="available" fill="#10b981" name="Tersedia" />
                    </BarChart>
                </ResponsiveContainer>
            );
        }

        if (activeTab === 'income') {
            return (
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={reportData.income.chart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatRupiah(value)} />
                        <Legend />
                        <Bar dataKey="income" fill="#10b981" name="Pemasukan" />
                        <Bar dataKey="expense" fill="#ef4444" name="Pengeluaran (Maintenance)" />
                    </BarChart>
                </ResponsiveContainer>
            );
        }

        return (
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={reportData.inout.chart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="in" fill="#8884d8" name="Masuk" />
                    <Bar dataKey="out" fill="#82ca9d" name="Keluar" />
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
                <Header title="Dashboard" username={username} />
            </div>

            <div className="p-">
                {/* ✅ MENU DENGAN GARIS */}
                <div className="mb-4">
                    <div className="flex w-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-md">
                        {[
                            { key: 'income', icon: <DollarOutlined />, label: 'Pemasukan' },
                            { key: 'customer', icon: <UserOutlined />, label: 'Customer' },
                            { key: 'room', icon: <HomeOutlined />, label: 'Kamar' },
                            { key: 'inout', icon: <SwapOutlined />, label: 'Keluar Masuk' },
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
                                    borderRight: index !== 3 ? '1px solid #DBDCDE' : 'none'
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
                                <div className="flex justify-between items-center p-1">
                                    <div>
                                        <Text className="text-gray-500 text-xs">Total Customer</Text>
                                        <Title level={4} style={{ margin: '4px 0 0 0' }}>{totalCustomer}</Title>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-2xl flex items-center justify-center">
                                        <UserOutlined style={{ fontSize: '20px', color: '#3b82f6' }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card size="small" className="shadow-md" style={{ borderRadius: 15 }}>
                                <div className="flex justify-between items-center p-1">
                                    <div>
                                        <Text className="text-gray-500 text-xs">Aktif</Text>
                                        <Title level={4} className="!text-green-600" style={{ margin: '4px 0 0 0' }}>{totalAktif}</Title>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-2xl flex items-center justify-center">
                                        <CheckCircleOutlined style={{ fontSize: '20px', color: '#10b981' }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card size="small" className="shadow-md" style={{ borderRadius: 15 }}>
                                <div className="flex justify-between items-center p-1">
                                    <div>
                                        <Text className="text-gray-500 text-xs">Nonaktif</Text>
                                        <Title level={4} className="!text-red-500" style={{ margin: '4px 0 0 0' }}>{totalNonaktif}</Title>
                                    </div>
                                    <div className="p-3 bg-red-50 rounded-2xl flex items-center justify-center">
                                        <CloseCircleOutlined style={{ fontSize: '20px', color: '#ef4444' }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                )}

                {activeTab === 'room' && (
                    <Row gutter={[12, 12]} className="mt-4 mb-4">
                        <Col xs={24} md={8}>
                            <Card size="small" className="shadow-md" style={{ borderRadius: 15 }}>
                                <div className="flex justify-between items-center p-1">
                                    <div>
                                        <Text className="text-gray-500 text-xs">Total Room</Text>
                                        <Title level={4} style={{ margin: '4px 0 0 0' }}>{totalRooms}</Title>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-2xl flex items-center justify-center">
                                        <HomeOutlined style={{ fontSize: '20px', color: '#3b82f6' }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card size="small" className="shadow-md" style={{ borderRadius: 15 }}>
                                <div className="flex justify-between items-center p-1">
                                    <div>
                                        <Text className="text-gray-500 text-xs">Room Tersedia</Text>
                                        <Title level={4} className="!text-green-600" style={{ margin: '4px 0 0 0' }}>{roomsTersedia}</Title>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-2xl flex items-center justify-center">
                                        <CheckCircleOutlined style={{ fontSize: '20px', color: '#10b981' }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card size="small" className="shadow-md" style={{ borderRadius: 15 }}>
                                <div className="flex justify-between items-center p-1">
                                    <div>
                                        <Text className="text-gray-500 text-xs">Room Terisi</Text>
                                        <Title level={4} className="!text-blue-500" style={{ margin: '4px 0 0 0' }}>{roomsTerisi}</Title>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-2xl flex items-center justify-center">
                                        <BookOutlined style={{ fontSize: '20px', color: '#f97316' }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                )}

                {activeTab === 'income' && (
                    <Row gutter={[12, 12]} className="mt-4 mb-4">
                        <Col xs={24} sm={12} md={6}>
                            <Card size="small" className="shadow-md" style={{ borderRadius: 15 }}>
                                <div className="flex justify-between items-center p-1">
                                    <div>
                                        <Text className="text-gray-500 text-xs">Total Pendapatan</Text>
                                        <Title level={4} className="!text-green-600" style={{ margin: '4px 0 0 0' }}>{formatRupiah(totalPendapatan)}</Title>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-2xl flex items-center justify-center">
                                        <DollarOutlined style={{ fontSize: '20px', color: '#10b981' }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card size="small" className="shadow-md" style={{ borderRadius: 15 }}>
                                <div className="flex justify-between items-center p-1">
                                    <div>
                                        <Text className="text-gray-500 text-xs">Total Pengeluaran</Text>
                                        <Title level={4} className="!text-red-500" style={{ margin: '4px 0 0 0' }}>{formatRupiah(totalMaintenance)}</Title>
                                    </div>
                                    <div className="p-3 bg-red-50 rounded-2xl flex items-center justify-center">
                                        <DollarOutlined style={{ fontSize: '20px', color: '#ef4444' }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card size="small" className="shadow-md" style={{ borderRadius: 15 }}>
                                <div className="flex justify-between items-center p-1">
                                    <div>
                                        <Text className="text-gray-500 text-xs">Keuntungan Bersih</Text>
                                        <Title level={4} className={netProfit >= 0 ? "!text-blue-600" : "!text-red-500"} style={{ margin: '4px 0 0 0' }}>{formatRupiah(netProfit)}</Title>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-2xl flex items-center justify-center">
                                        <DollarOutlined style={{ fontSize: '20px', color: '#3b82f6' }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card size="small" className="shadow-md" style={{ borderRadius: 15 }}>
                                <div className="flex justify-between items-center p-1">
                                    <div>
                                        <Text className="text-gray-500 text-xs">Pending</Text>
                                        <Title level={4} className="!text-orange-500" style={{ margin: '4px 0 0 0' }}>{formatRupiah(totalPending)}</Title>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-2xl flex items-center justify-center">
                                        <ClockCircleOutlined style={{ fontSize: '20px', color: '#f97316' }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* CONTENT */}
                <Card style={{ borderRadius: 15 }} className="shadow-md"
                    title="Report View"
                    extra={
                        <Space>
                            <DatePicker 
                                picker="month" 
                                value={selectedMonth}
                                onChange={(date) => setSelectedMonth(date)}
                            />
                            <Button icon={<DownloadOutlined />} type="primary" onClick={handleDownload}>Download</Button>
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