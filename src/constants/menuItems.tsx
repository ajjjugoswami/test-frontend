import { LayoutDashboard, Bot } from 'lucide-react';

export const menuItems = [
  {
    key: '/',
    icon: <LayoutDashboard size={18} color="white" />,
    label: 'Dashboard',
  },
  {
    key: '/ai-agent',
    icon: <Bot size={18} color="white" />,
    label: 'AI HTML Generator',
  },
];