import React from 'react';
import { Card, Typography, Row, Col, Statistic, Avatar } from 'antd';
import { UserOutlined, DashboardOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <DashboardOutlined style={{ marginRight: '12px' }} />
          Dashboard
        </Title>
        <Text type="secondary">Welcome to your dashboard</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="User ID"
              value={user?.id || 'N/A'}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Email"
              value={user?.email || 'N/A'}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Status"
              value="Active"
              valueStyle={{ color: '#3f8600' }}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Profile Information" bordered={false}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Avatar size={64} icon={<UserOutlined />} />
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {user?.email}
                </Title>
                <Text type="secondary">Registered User</Text>
                <br />
                <Text type="secondary">
                  Account created successfully. You can now access all features.
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;