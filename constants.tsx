
import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Bot, 
  Search, 
  User, 
  Globe, 
  TrendingUp, 
  Users, 
  Video, 
  ShoppingCart,
  Zap,
  ChevronRight,
  ChevronUp,
  AlertCircle,
  Undo,
  LayoutGrid,
  List
} from 'lucide-react';

export const ICONS = {
  Dashboard: <LayoutDashboard size={20} />,
  Market: <BarChart3 size={20} />,
  Agent: <Bot size={20} />,
  Discovery: <Search size={20} />,
  Profile: <User size={20} />,
  Globe: <Globe size={16} />,
  Search: <Search size={16} />,
  Trends: <TrendingUp size={16} />,
  Users: <Users size={16} />,
  Video: <Video size={16} />,
  Cart: <ShoppingCart size={16} />,
  Zap: <Zap size={16} />,
  Chevron: <ChevronRight size={16} />,
  ChevronUp: <ChevronUp size={20} />,
  Alert: <AlertCircle size={16} />,
  Undo: <Undo size={14} />,
  Grid: <LayoutGrid size={18} />,
  List: <List size={18} />
};

export const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' }
];
