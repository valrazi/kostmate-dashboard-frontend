import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
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

// --- DATA ---
const branchData = [
  { name: 'Kost Anugrah', Terisi: 27, Kosong: 13 },
  { name: 'Kost Berkah', Terisi: 40, Kosong: 10 },
  { name: 'Kost Ceria', Terisi: 15, Kosong: 25 },
  { name: 'Kost Damai', Terisi: 35, Kosong: 5 },
];

const paymentTrend = [
  { name: 'Jan', Pendapatan: 40000000 },
  { name: 'Feb', Pendapatan: 42000000 },
  { name: 'Mar', Pendapatan: 45000000 },
  { name: 'Apr', Pendapatan: 41000000 },
  { name: 'Mei', Pendapatan: 50000000 },
  { name: 'Jun', Pendapatan: 55000000 },
];

function Dashboard() {
  const username = "Manto Ariyansyah";

  return (
    <div className="min-h-screen bg-gray-100">

      <div 
        className="sticky z-50 bg-gray-100 -mt-6 -mx-6 px-6 pt-6 pb-4 mb-2"
        style={{ top: '0px' }}
      >
        {/* HEADER */}
        <Header title="Branch" username={username} />

      </div>

      {/* CONTENT */}
      <div className="px-4 md:px-6">

        {/* STATISTIC */}
        <Row gutter={[16, 16]}>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
              <Statistic
                title="Total Branch"
                value={4}
                prefix={<BranchesOutlined style={{ color: "#6366f1" }} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
              <Statistic
                title="Total Customer"
                value={117}
                prefix={<UserOutlined style={{ color: "#22c55e" }} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
              <Statistic
                title="Room Terisi"
                value={117}
                suffix="/ 170"
                prefix={<HomeOutlined style={{ color: "#f59e0b" }} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
              <Statistic
                title="Pendapatan"
                value={55000000}
                prefix={<CreditCardOutlined style={{ color: "#3b82f6" }} />}
                formatter={(val) => `Rp ${val.toLocaleString()}`}
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
              className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="w-full h-[260px] md:h-[320px]">
                <ResponsiveContainer>
                  <BarChart data={branchData} barGap={6}>
                    
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
            </Card>
          </Col>

          {/* AREA CHART */}
          <Col xs={24} lg={12}>
            <Card
              title="Tren Pendapatan"
              className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="w-full h-[260px] md:h-[320px]">
                <ResponsiveContainer>
                  <AreaChart data={paymentTrend}>
                    
                    <defs>
                      <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />

                    <YAxis
                      tickFormatter={(val) => `${val / 1000000}Jt`}
                      tick={{ fontSize: 12 }}
                    />

                    <Tooltip
                      formatter={(val) => `Rp ${val.toLocaleString()}`}
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
            </Card>
          </Col>

        </Row>
      </div>
    </div>
  );
}

export default Dashboard;