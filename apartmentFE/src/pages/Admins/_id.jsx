import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  CssBaseline,
  Paper,
  Avatar,
  Divider,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BarChartIcon from '@mui/icons-material/BarChart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BuildIcon from '@mui/icons-material/Build';
import HandymanIcon from '@mui/icons-material/Handyman';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonIcon from '@mui/icons-material/Person';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

import NotificationManagement from './NotificationManagement/NotificationManagement';
import BillManagement from './BillManagement/BillManagement';
import EmployeeManagement from './EmployeeManagement/EmployeeManagement';
import TaskManagement from './TaskManagement/TaskManagement';
import VehicleManagement from './VehicleManagement/VehicleManagement';
import ReportManagement from './ReportManagement/ReportManagement';
import FeeManagement from './FeeManagement/FeeManagement';
import MaintenanceManagement from './MaintenanceManagement/MaintenanceManagement';
import RepairManagement from './RepairManagement/RepairManagement';
import ApartmentManagement from './ApartmentManagement/ApartmentManagement';
import ResidentManagement from './ResidentManagement/ResidentManagement';
import ServiceManagement from './ServiceManagement/ServiceManagement';
import UserManagement from './UserManagement/UserManagement';
import ComplaintManagement from './ComplaintManagement/ComplaintManagement';

const drawerWidth = 280;

// Sắp xếp lại menu items theo nhóm chức năng
const menuItems = [
  // Quản lý cơ bản
  { 
    label: 'Quản lý căn hộ', 
    icon: <ApartmentIcon />, 
    component: <ApartmentManagement />,
    group: 'basic'
  },
  { 
    label: 'Quản lý cư dân', 
    icon: <PersonIcon />, 
    component: <ResidentManagement />,
    group: 'basic'
  },
  { 
    label: 'Quản lý nhân viên', 
    icon: <PeopleIcon />, 
    component: <EmployeeManagement />,
    group: 'basic'
  },
  { 
    label: 'Quản lý người dùng', 
    icon: <ManageAccountsIcon />, 
    component: <UserManagement />,
    group: 'basic'
  },

  // Quản lý tài chính
  { 
    label: 'Quản lý hóa đơn', 
    icon: <ReceiptIcon />, 
    component: <BillManagement />,
    group: 'finance'
  },
  { 
    label: 'Quản lý phí', 
    icon: <MonetizationOnIcon />, 
    component: <FeeManagement />,
    group: 'finance'
  },

  // Quản lý dịch vụ
  { 
    label: 'Quản lý dịch vụ', 
    icon: <MiscellaneousServicesIcon />, 
    component: <ServiceManagement />,
    group: 'services'
  },
  { 
    label: 'Quản lý phương tiện', 
    icon: <DirectionsCarIcon />, 
    component: <VehicleManagement />,
    group: 'services'
  },

  // Quản lý bảo trì
  { 
    label: 'Quản lý bảo trì', 
    icon: <BuildIcon />, 
    component: <MaintenanceManagement />,
    group: 'maintenance'
  },
  { 
    label: 'Quản lý sửa chữa', 
    icon: <HandymanIcon />, 
    component: <RepairManagement />,
    group: 'maintenance'
  },

  // Quản lý công việc
  { 
    label: 'Quản lý công việc', 
    icon: <AssignmentIcon />, 
    component: <TaskManagement />,
    group: 'tasks'
  },
  { 
    label: 'Quản lý khiếu nại', 
    icon: <ReportProblemIcon />, 
    component: <ComplaintManagement />,
    group: 'tasks'
  },

  // Quản lý thông tin
  { 
    label: 'Quản lý thông báo', 
    icon: <NotificationsIcon />, 
    component: <NotificationManagement />,
    group: 'info'
  },
  { 
    label: 'Quản lý báo cáo', 
    icon: <BarChartIcon />, 
    component: <ReportManagement />,
    group: 'info'
  },
];

const AdminId = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Sử dụng trực tiếp menuItems thay vì filteredMenuItems
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {});

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ 
      height: '100%',
      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
        animation: 'pulse 15s infinite',
      },
      '@keyframes pulse': {
        '0%': {
          transform: 'translate(-50%, -50%) scale(1)',
        },
        '50%': {
          transform: 'translate(-50%, -50%) scale(1.1)',
        },
        '100%': {
          transform: 'translate(-50%, -50%) scale(1)',
        },
      },
    }}>
      <Box sx={{ 
        position: 'relative',
        zIndex: 1,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          mb: 3,
          p: 2
        }}>
          <Avatar sx={{ 
            bgcolor: 'white',
            width: 48,
            height: 48,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <DashboardIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          </Avatar>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(to right, #ffffff, #e3f2fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px'
            }}
          >
            ApartMaster
          </Typography>
        </Box>

        <Divider sx={{ 
          borderColor: 'rgba(255,255,255,0.1)',
          mb: 2
        }} />

        <Box sx={{ 
          flex: 1,
          overflow: 'hidden',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ 
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255,255,255,0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(255,255,255,0.3)',
            },
            width: '100%',
          }}>
            {Object.entries(groupedMenuItems).map(([group, items]) => (
              <React.Fragment key={group}>
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 1,
                    display: 'block',
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                  }}
                >
                  {group === 'basic' && 'Quản lý cơ bản'}
                  {group === 'finance' && 'Quản lý tài chính'}
                  {group === 'services' && 'Quản lý dịch vụ'}
                  {group === 'maintenance' && 'Quản lý bảo trì'}
                  {group === 'tasks' && 'Quản lý công việc'}
                  {group === 'info' && 'Quản lý thông tin'}
                </Typography>
                {items.map((item) => (
                  <Tooltip 
                    key={item.label}
                    title={item.label}
                    placement="right"
                    arrow
                  >
                    <ListItem
                      button
                      selected={selectedIndex === menuItems.indexOf(item)}
                      onClick={() => handleListItemClick(menuItems.indexOf(item))}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        mx: 1,
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.15)',
                          },
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.05)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: selectedIndex === menuItems.indexOf(item) ? 'white' : 'rgba(255,255,255,0.7)',
                        minWidth: 40
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.label} 
                        primaryTypographyProps={{
                          sx: {
                            fontWeight: selectedIndex === menuItems.indexOf(item) ? 600 : 400,
                            color: selectedIndex === menuItems.indexOf(item) ? 'white' : 'rgba(255,255,255,0.7)',
                            fontSize: '0.95rem',
                            letterSpacing: '0.3px'
                          }
                        }}
                      />
                    </ListItem>
                  </Tooltip>
                ))}
                <Divider sx={{ 
                  borderColor: 'rgba(255,255,255,0.1)',
                  my: 1
                }} />
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            {menuItems[selectedIndex]?.label || 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Paper 
          elevation={0}
          sx={{
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            minHeight: 'calc(100vh - 88px)',
          }}
        >
          {menuItems[selectedIndex]?.component || <DashboardIcon />}
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminId;
