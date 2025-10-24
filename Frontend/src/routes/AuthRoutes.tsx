// AuthRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../Redux/store'
import { ReactElement, lazy, Suspense } from "react"
import Loader from '../Components/ui/Loader'
import { NotificationProvider } from '../Notifications/NotificationListner'

// Lazy loaded components
const Landing = lazy(() => import('../Components/Landing/Landing'))
const Signup = lazy(() => import('../Components/Login/Signup'))
const LoginPage = lazy(() => import('../Components/Login/Login'))
const OTPVerificationPage = lazy(() => import('../Components/Login/Otp'))
const ProfilePage = lazy(() => import('../Components/User/ProfileDetailPage'))
const NewspaperPage = lazy(() => import('../Components/User/AboutPage'))
const FoodSection = lazy(() => import('../Components/User/FoodPage'))
const UserSettings = lazy(() => import('../Components/User/Settings'))
const ResetPassword = lazy(() => import('../Components/ForgetPassword/ResetPassword'))
const ProductPage = lazy(() => import('../Components/User/HotelsDetailsPage'))
const CartPage = lazy(() => import('../Components/User/CartPage'))
const CheckOutPage = lazy(() => import('../Components/User/CheckOutPage'))
const OrderHistoryPage = lazy(() => import('../Components/User/OrderHistoryPage'))
const InvoiceGenerator = lazy(() => import('../Components/User/InvoiceGenarator'))
const RatingAndReview = lazy(() => import('../Components/User/RatingAndReview'))
const Wallet = lazy(() => import('../../src/Components/User/Wallet'))
const Inbox = lazy(() => import('../../src/Components/User/Inbox'))

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
      <Suspense fallback={<Loader />}>
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
          <Route path='/checkout' element={<CheckOutPage />} />
          <Route path='/order-history' element={<OrderHistoryPage />} />
          <Route path='/get-invoice/:orderId' element={<InvoiceGenerator />} />
          <Route path='/rating/:hotelId' element={<RatingAndReview />} />
          <Route path='/wallet' element={<Wallet />} />
          <Route path='/inbox' element={<Inbox />} />
          <Route path='about-page' element={<NewspaperPage/>}/>
          <Route path='food-section' element={<FoodSection />}/>
          <Route path='explore-food/:hotelId' element={<ProductPage />} />
          <Route path='otp' element={
            <PublicRoute>
              <OTPVerificationPage />
            </PublicRoute>
          } />
        </Routes>
      </Suspense>
    </NotificationProvider>
  );
}

export default AuthRoutes