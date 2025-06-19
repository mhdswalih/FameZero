import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import Landing from '../Components/Landing/Landing'
import Signup from '../Components/User/SignIn'
import LoginPage from '../Components/User/Login'
import OTPVerificationPage from '../Components/User/Otp'
import ProfilePage from '../Components/User/ProfileDetailPage'
import NewspaperPage from '../Components/User/AboutPage'
import { ReactElement } from 'react'
import Navbar from '../Components/Navbar'

const ProtectedRoute = ({ children }: { children:ReactElement }) => {
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = !!user.token;
  return isAuthenticated ? children : <Navigate to='/login' replace />;
};

const PublicRoute = ({ children }: { children: ReactElement }) => {
  const user = useSelector((state: RootState) => state.user);
  console.log(user,'this is user from user side');
  
  const isAuthenticated = !!user.token;
  
  return !isAuthenticated ? children : <Navigate to='/' replace />;
};

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='signup' element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      } />
      <Route path='login' element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
          <Route path='profile-details' element={
            // <ProtectedRoute>
              <ProfilePage/>
            // </ProtectedRoute>
              } />
        <Route path='about-page' element={
          <>
          <Navbar />
            <NewspaperPage/>
          </>
        }/>
      <Route path='otp' element={
        <ProtectedRoute>
          <OTPVerificationPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default AuthRoutes