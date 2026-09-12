import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import EmployeeManagement from './pages/Admins/EmployeeManagement/EmployeeManagement'
import AdminId from './pages/Admins/_id'
import ClientId from './pages/Clients/_id';
import Auth from './pages/Auth/Auth'
import Login from './pages/Auth/Login'
import Dashboard from './pages/Admins/Dashboard/Dashboard'
import ApartmentManagement from './pages/Admins/ApartmentManagement/ApartmentManagement'
import ResidentManagement from './pages/Admins/ResidentManagement/ResidentManagement'
import UserManagement from './pages/Admins/UserManagement/UserManagement'
import BillManagement from './pages/Admins/BillManagement/BillManagement'
import FeeManagement from './pages/Admins/FeeManagement/FeeManagement'
import ServiceManagement from './pages/Admins/ServiceManagement/ServiceManagement'
import VehicleManagement from './pages/Admins/VehicleManagement/VehicleManagement'
import MaintenanceManagement from './pages/Admins/MaintenanceManagement/MaintenanceManagement'
import RepairManagement from './pages/Admins/RepairManagement/RepairManagement'
import TaskManagement from './pages/Admins/TaskManagement/TaskManagement'
import ComplaintManagement from './pages/Admins/ComplaintManagement/ComplaintManagement'
import NotificationManagement from './pages/Admins/NotificationManagement/NotificationManagement'
import ReportManagement from './pages/Admins/ReportManagement/ReportManagement'

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/auth" element={<Auth />}>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin/*"
        element={
          <AdminId />
        }
      >
        <Route index element={<ApartmentManagement />} />
        <Route path="apartments" element={<ApartmentManagement />} />
        <Route path="residents" element={<ResidentManagement />} />
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="bills" element={<BillManagement />} />
        <Route path="fees" element={<FeeManagement />} />
        <Route path="services" element={<ServiceManagement />} />
        <Route path="vehicles" element={<VehicleManagement />} />
        <Route path="maintenance" element={<MaintenanceManagement />} />
        <Route path="repairs" element={<RepairManagement />} />
        <Route path="tasks" element={<TaskManagement />} />
        <Route path="complaints" element={<ComplaintManagement />} />
        <Route path="notifications" element={<NotificationManagement />} />
        <Route path="reports" element={<ReportManagement />} />
      </Route>

      {/* Client routes */}
      <Route
        path="/client/*"
        element={
            <ClientId />
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        {/* Add client routes here */}
      </Route>

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
}

export default App;