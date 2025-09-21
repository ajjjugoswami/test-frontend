import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { LoginCredentials } from '../../types/auth';

const { Title, Text } = Typography;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  padding: 20px;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const StyledTitle = styled(Title)`
  margin-bottom: 8px !important;
  color: #1a1a1a !important;
`;

const StyledText = styled(Text)`
  color: #666 !important;
`;

const FooterSection = styled.div`
  text-align: center;
  margin-top: 24px;
`;

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const onFinish = async (values: LoginCredentials) => {
    setLoading(true);
    try {
      const result = await login(values);
      if (result.success) {
        message.success('Login successful!');
        onLoginSuccess?.();
      } else {
        message.error(result.message || 'Login failed');
      }
    } catch (error) {
      message.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <StyledCard>
        <HeaderSection>
          <StyledTitle level={2}>Welcome Back</StyledTitle>
          <StyledText type="secondary">Sign in to your account</StyledText>
        </HeaderSection>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<LoginOutlined />}
              size="large"
              block
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <FooterSection>
          <Space>
            <Text>Don't have an account?</Text>
            <Button type="link" onClick={onSwitchToSignup} style={{ padding: 0 }}>
              Sign Up
            </Button>
          </Space>
        </FooterSection>
      </StyledCard>
    </Container>
  );
};

export default LoginForm;