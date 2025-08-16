import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import Landing from '../Components/Landing/Landing'
import Signup from '../Components/Login/Signup'
import LoginPage from '../Components/Login/Login'
import OTPVerificationPage from '../Components/Login/Otp'
import ProfilePage from '../Components/User/ProfileDetailPage'
import NewspaperPage from '../Components/User/AboutPage'
import { ReactElement } from 'react'
import FoodSection from '../Components/User/FoodPage'
import { Settings } from 'lucide-react'
import UserSettings from '../Components/User/Settings'
import ResetPassword from '../Components/ForgetPassword/ResetPassword'

const ProtectedRoute = ({ children }: { children:ReactElement }) => {
  const user = useSelector((state: RootState) => state.user);
  const isAuthenticated = !!user.token;
  return isAuthenticated ? children : <Navigate to='/login' replace />;
};

const PublicRoute = ({ children }: { children: ReactElement }) => {
  const user = useSelector((state: RootState) => state.user);  
  console.log(user,'///////////////////////////////////////');
  
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
        <Route path='settings' element={<UserSettings />}/> 
        <Route path='reset-password' element={<ResetPassword />} />     
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