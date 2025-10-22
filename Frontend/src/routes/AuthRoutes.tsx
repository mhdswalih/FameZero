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
import UserSettings from '../Components/User/Settings'
import ResetPassword from '../Components/ForgetPassword/ResetPassword'
import ProductPage from '../Components/User/HotelsDetailsPage'
import CartPage from '../Components/User/CartPage'
import WishListPage from '../Components/User/WishList'
import CheckOutPage from '../Components/User/CheckOutPage'
import OrderHistoryPage from '../Components/User/OrderHistoryPage'
import InvoiceGenerator from '../Components/User/InvoiceGenarator'
import RatingAndReview from '../Components/User/RatingAndReview'
import { NotificationProvider } from '../Notifications/NotificationListner'
import  Wallet  from '../../src/Components/User/Wallet'

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
      <NotificationProvider>
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
            <ProtectedRoute>
              <ProfilePage />
             </ProtectedRoute>
              } />
        <Route path='settings' element={<UserSettings />}/> 
        <Route path='reset-password' element={<ResetPassword />} />   
        <Route path='/cart' element={<CartPage />} />
        <Route path='/wishlist' element={<WishListPage />} /> 
        <Route path='/checkout' element={<CheckOutPage />} />
        <Route path='/order-history' element={<OrderHistoryPage />} />
        <Route path='/get-invoice/:orderId' element={<InvoiceGenerator />} />
        <Route path='/rating/:hotelId' element={<RatingAndReview />} />
        <Route path='/wallet' element={<Wallet />} />
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
        <Route path='explore-food/:hotelId' element={
          <>
          <ProductPage />
          </>
        } />
      <Route path='otp' element={
        <PublicRoute>
          <OTPVerificationPage />
        </PublicRoute>
      } />
    </Routes>
      </NotificationProvider>
  );
}

export default AuthRoutes