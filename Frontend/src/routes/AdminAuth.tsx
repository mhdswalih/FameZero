// AdminAuth.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import { ReactElement, lazy, Suspense } from 'react';
import Loader from '../Components/ui/Loader';

// Lazy loaded components
const AdminHomePage = lazy(() => import('../Components/Admin/AdminHomePage'));
const UserTable = lazy(() => import('../Components/Admin/tables/Users'));
const HotelsTable = lazy(() => import('../Components/Admin/tables/Hotels&Resorts'));
const AdminLogin = lazy(() => import('../Components/Admin/AdminLogin'));
const DashBoard = lazy(() => import('../Components/Admin/Pages/DashBoard'));

const AdminAuth = () => {
  const ProtectedRouteAdmin = ({children} : {children: ReactElement}) => {
    const admin = useSelector((state:RootState)=> state.admin)   
    const isAuthenticated = !!admin.token;
    return isAuthenticated ? children : <Navigate to='/admin/login' replace />
  }

  const PublicRouteAdmin = ({children} : {children:ReactElement}) => {
    const admin = useSelector((state:RootState) => state.admin)
    const isAuthenticated = !!admin.token
    return !isAuthenticated ? children : <Navigate to="/" replace />
  }

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={
          <PublicRouteAdmin>
            <AdminLogin />
          </PublicRouteAdmin>
        } />
        <Route path="/" element={
          <ProtectedRouteAdmin>
            <AdminHomePage />
          </ProtectedRouteAdmin>
        } />
        <Route path='/dashboard' element={
          <ProtectedRouteAdmin>
            <DashBoard />
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
      </Routes>
    </Suspense>
  );
};

export default AdminAuth;