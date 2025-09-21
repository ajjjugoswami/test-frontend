import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import { LayoutDashboard, User, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
          <LayoutDashboard size={24} style={{ marginRight: 12 }} />
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome to your dashboard
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User ID
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <User size={20} style={{ marginRight: 8 }} />
                <Typography variant="h4">
                  {user?.id || 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Email
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <User size={20} style={{ marginRight: 8 }} />
                <Typography variant="h4">
                  {user?.email || 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Settings size={20} style={{ marginRight: 8 }} />
                <Typography variant="h4" sx={{ color: '#3f8600' }}>
                  Active
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Profile Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 64, height: 64 }}>
                <User size={32} />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Registered User
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Account created successfully. You can now access all features.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;