import { Typography, Box } from "@mui/material";
import { LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <LayoutDashboard size={24} style={{ marginRight: 12 }} />
          Dashboard
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
