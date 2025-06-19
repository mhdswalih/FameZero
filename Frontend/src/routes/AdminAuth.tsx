import { Routes, Route, Navigate } from 'react-router-dom';
import AdminHomePage from '../Components/Admin/AdminHomePage';
import UserTable from '../Components/Admin/tables/Users';
import HotelsTable from '../Components/Admin/tables/Hotels&Resorts';
import AdminLogin from '../Components/Admin/AdminLogin'; 
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { ReactElement } from 'react';

const AdminAuth = () => {
  const ProtectedRouteAdmin = ({children} : {children: ReactElement}) => {
    const admin = useSelector((state:RootState)=> state.admin) 
    console.log(admin,'this admin form ru');
    
    const isAuthenticated = !!admin.token;
    return isAuthenticated ? children : <Navigate to='login' replace />
  }

  const PublicRouteAdmin = ({children} : {children:ReactElement}) => {
    const admin = useSelector((state:RootState) => state.admin)
    const isAuthenticated = !!admin.token
    return !isAuthenticated ? children : <Navigate to="/" replace />
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRouteAdmin>
          <AdminLogin />
        </PublicRouteAdmin>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRouteAdmin>
          <AdminHomePage />
        </ProtectedRouteAdmin>
      } />
      <Route path="/user-table" element={
        <ProtectedRouteAdmin>
          <UserTable />
        </ProtectedRouteAdmin>
      } />
      <Route path="/hotels-table" element={
        <ProtectedRouteAdmin>
          <HotelsTable />
        </ProtectedRouteAdmin>
      } />

      {/* Catch all route */}
      {/* <Route path="*" element={<Navigate to="" replace />} /> */}
    </Routes>
  );
};

export default AdminAuth;