import { Form, Input, Button, Card, Typography, Space, Image } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAppStore from '../store/useAppStore';

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set user in store with email from form
      setUser({
        email: values.email,
        loginTime: new Date(),
      });
      
      // Navigate to branch on successful login
      navigate('/branch');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card 
        className="w-full max-w-md shadow-lg"
        style={{ borderRadius: '8px' }}
      >
        {/* Header */}
        <Space orientation="vertical" size="large" style={{ width: '100%' }} className="text-center">
          <div>
            <div className="flex justify-center items-center mb-4">
                <Image
                    src="/src/assets/img/Vector 679.png"
                    alt="logo"
                    width={64}
                    preview={false}
                />
            </div>
            <Title level={2} className="mb-0">Kostmate</Title>
            <Text type="secondary">Login to your account</Text>
          </div>

          {/* Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            {/* Email Field */}
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                size="large"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                size="large"
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          {/* Footer */}
          <Text type="secondary" style={{ fontSize: '12px' }}>
            © 2024 Kostmate. All rights reserved.
          </Text>
        </Space>
      </Card>
    </div>
  );
}

export default Login;
