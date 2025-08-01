import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import Landing from '../Components/Landing/Landing'
import Signup from '../Components/User/Signup'
import LoginPage from '../Components/User/Login'
import OTPVerificationPage from '../Components/User/Otp'
import ProfilePage from '../Components/User/ProfileDetailPage'
import NewspaperPage from '../Components/User/AboutPage'
import { ReactElement } from 'react'
import Navbar from '../Components/UserNav&Footer/Navbar'
import FoodSection from '../Components/User/FoodPage'

const ProtectedRoute = ({ children }: { children:ReactElement }) => {
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = !!user.token;
  return isAuthenticated ? children : <Navigate to='/login' replace />;
};

const PublicRoute = ({ children }: { children: ReactElement }) => {
  const user = useSelector((state: RootState) => state.user);  
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
              <ProfilePage />
            // </ProtectedRoute>
              } />
        <Route path='about-page' element={
          <>
          {/* <Navbar /> */}
            <NewspaperPage/>
          </>
        }/>
        <Route path='food-section' element={
          <>
            {/* <Navbar /> */}
            <FoodSection />
          </>
        }/>
      <Route path='otp' element={
        <PublicRoute>
          <OTPVerificationPage />
        </PublicRoute>
      } />
    </Routes>
  );
}

export default AuthRoutes