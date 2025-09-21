import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { SignupCredentials } from '../../types/auth';

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

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSignupSuccess?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin, onSignupSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const onFinish = async (values: SignupCredentials) => {
    setLoading(true);
    try {
      const result = await signup(values);
      if (result.success) {
        message.success(result.message || 'Account created successfully!');
        onSignupSuccess?.();
        // Clear form
        // The form will be reset automatically since we're not controlling the state
      } else {
        message.error(result.message || 'Signup failed');
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
          <StyledTitle level={2}>Create Account</StyledTitle>
          <StyledText type="secondary">Sign up to get started</StyledText>
        </HeaderSection>

        <Form
          name="signup"
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
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<UserAddOutlined />}
              size="large"
              block
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <FooterSection>
          <Space>
            <Text>Already have an account?</Text>
            <Button type="link" onClick={onSwitchToLogin} style={{ padding: 0 }}>
              Sign In
            </Button>
          </Space>
        </FooterSection>
      </StyledCard>
    </Container>
  );
};

export default SignupForm;