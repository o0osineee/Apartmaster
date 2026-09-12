import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  People as PeopleIcon,
  Home as HomeIcon,
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const theme = useTheme();

  const stats = [
    {
      title: 'Tổng số cư dân',
      value: '150',
      icon: <PeopleIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      color: theme.palette.primary.light,
    },
    {
      title: 'Tổng số căn hộ',
      value: '100',
      icon: <HomeIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      color: theme.palette.success.light,
    },
    {
      title: 'Bảo trì đang thực hiện',
      value: '5',
      icon: <BuildIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
      color: theme.palette.warning.light,
    },
    {
      title: 'Công việc đang thực hiện',
      value: '8',
      icon: <AssignmentIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />,
      color: theme.palette.info.light,
    },
    {
      title: 'Thông báo mới',
      value: '3',
      icon: <NotificationsIcon sx={{ fontSize: 40, color: theme.palette.error.main }} />,
      color: theme.palette.error.light,
    },
    {
      title: 'Hóa đơn chờ thanh toán',
      value: '12',
      icon: <ReceiptIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      color: theme.palette.secondary.light,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.main }}>
        Tổng quan
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: stat.color,
                      borderRadius: '50%',
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 