import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Auth = () => {
  return (
    <Container disableGutters maxWidth={false} sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
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
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        position: 'relative',
        zIndex: 1,
        padding: 4,
      }}>
        <Paper elevation={0} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'transparent',
          color: 'white',
          maxWidth: 400,
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              marginBottom: 2,
              background: 'linear-gradient(to right, #ffffff, #e3f2fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px'
            }}
          >
            ApartMaster
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: 3,
              letterSpacing: '0.5px'
            }}
          >
            Hệ thống quản lý chung cư
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: 1.7,
              letterSpacing: '0.3px'
            }}
          >
            Giải pháp quản lý chung cư toàn diện, giúp bạn dễ dàng theo dõi và quản lý mọi hoạt động của tòa nhà.
          </Typography>
        </Paper>
        <Outlet />
      </Box>
    </Container>
  );
}

export default Auth;
