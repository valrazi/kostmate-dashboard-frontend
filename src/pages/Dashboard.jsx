import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Spin, message } from 'antd';
import {
  BranchesOutlined,
  UserOutlined,
  HomeOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import Header from '../components/Header';
import api from '../services/api';
import useAppStore from '../store/useAppStore';

function Dashboard() {
  const user = useAppStore((state) => state.user);
  const username = user?.name || "Admin";
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBranches: 0,
    totalCustomers: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    totalRevenue: 0,
    branchOccupancy: [],
    paymentTrend: []
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        // Provide owner_id if available, otherwise it returns all branches for admin
        const ownerIdParam = user?.role === 'OWNER' ? `?owner_id=${user.id}` : '';
        const response = await api.get(`/dashboard/stats${ownerIdParam}`);
        
        // Reverse payment trend to show oldest first (from 6 months ago to now)
        const reversedTrend = [...response.data.paymentTrend].reverse();
        
        setStats({
          ...response.data,
          paymentTrend: reversedTrend
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        message.error("Gagal mengambil data dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Spin size="large" tip="Memuat dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div 
        className="sticky z-50 bg-gray-100 -mt-6 -mx-6 px-6 pt-6 pb-4 mb-2"
        style={{ top: '0px' }}
      >
        <Header title="Dashboard" username={username} />
      </div>

      <div className="px-4 md:px-6 pb-10">

        {/* STATISTIC */}
        <Row gutter={[16, 16]}>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
              <Statistic
                title="Total Branch"
                value={stats.totalBranches}
                prefix={<BranchesOutlined style={{ color: "#6366f1" }} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
              <Statistic
                title="Total Customer"
                value={stats.totalCustomers}
                prefix={<UserOutlined style={{ color: "#22c55e" }} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
              <Statistic
                title="Room Terisi"
                value={stats.occupiedRooms}
                suffix={`/ ${stats.totalRooms}`}
                prefix={<HomeOutlined style={{ color: "#f59e0b" }} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
              <Statistic
                title="Pendapatan Keseluruhan"
                value={stats.totalRevenue}
                prefix={<CreditCardOutlined style={{ color: "#3b82f6" }} />}
                formatter={(val) => `Rp ${Number(val).toLocaleString('id-ID')}`}
              />
            </Card>
          </Col>

        </Row>

        {/* CHART */}
        <Row gutter={[16, 16]} className="mt-6">

          {/* BAR CHART */}
          <Col xs={24} lg={12}>
            <Card
              title="Okupansi Cabang"
              className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 h-full"
            >
              {stats.branchOccupancy.length === 0 ? (
                <div className="flex items-center justify-center h-[260px] text-gray-400">Belum ada data cabang</div>
              ) : (
                <div className="w-full h-[260px] md:h-[320px]">
                  <ResponsiveContainer>
                    <BarChart data={stats.branchOccupancy} barGap={6}>
                      
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />

                      <Tooltip
                        contentStyle={{
                          borderRadius: "10px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}
                      />

                      <Legend />

                      <Bar
                        dataKey="Terisi"
                        stackId="a"
                        fill="#6366f1"
                        radius={[6, 6, 0, 0]}
                      />

                      <Bar
                        dataKey="Kosong"
                        stackId="a"
                        fill="#e5e7eb"
                        radius={[6, 6, 0, 0]}
                      />

                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </Col>

          {/* AREA CHART */}
          <Col xs={24} lg={12}>
            <Card
              title="Tren Pendapatan (6 Bulan Terakhir)"
              className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 h-full"
            >
              {stats.paymentTrend.length === 0 ? (
                <div className="flex items-center justify-center h-[260px] text-gray-400">Belum ada data pendapatan</div>
              ) : (
                <div className="w-full h-[260px] md:h-[320px]">
                  <ResponsiveContainer>
                    <AreaChart data={stats.paymentTrend}>
                      
                      <defs>
                        <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />

                      <YAxis
                        tickFormatter={(val) => {
                          if (val >= 1000000) return `${val / 1000000}Jt`;
                          if (val >= 1000) return `${val / 1000}Rb`;
                          return val;
                        }}
                        tick={{ fontSize: 12 }}
                        width={60}
                      />

                      <Tooltip
                        formatter={(val) => `Rp ${Number(val).toLocaleString('id-ID')}`}
                        contentStyle={{
                          borderRadius: "10px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="Pendapatan"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fill="url(#colorPendapatan)"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />

                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </Col>

        </Row>
      </div>
    </div>
  );
}

export default Dashboard;