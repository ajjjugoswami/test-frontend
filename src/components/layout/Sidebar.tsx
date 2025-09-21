import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Box,
} from "@mui/material";
import { LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { menuItems } from "../../constants/menuItems";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItemsMapped = menuItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    onClick: () => handleMenuClick(item.key),
  }));

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 80,
        "& .MuiDrawer-paper": {
          width: 80,
          backgroundColor: "#4440cc",
          color: "white",
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: "center", fontWeight: "bold" }}></Box>
      <List>
        {menuItemsMapped.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={location.pathname === item.key}
              onClick={item.onClick}
              sx={{
                justifyContent: "center",
                "&.Mui-selected": {
                  backgroundColor: "#5555dd",
                  "&:hover": {
                    backgroundColor: "#6666ee",
                  },
                },
                "&:hover": {
                  backgroundColor: "#6666ee",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: "auto" }}>
                {item.icon}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <LogOut
          size={18}
          color="white"
          style={{ cursor: "pointer" }}
          onClick={handleLogout}
        />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
