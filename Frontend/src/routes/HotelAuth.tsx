// HotelAuth.tsx
import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Loader from '../Components/ui/Loader'

// Lazy loaded components
const LandingPage = lazy(() => import('../Components/Hotel/LandingPage'))
const HotelProfilePage = lazy(() => import('../Components/Hotel/HotelProfileDetails'))
const Settings = lazy(() => import('../Components/Hotel/Settings'))
const HotelFoodSections = lazy(() => import('../Components/Hotel/HotelFoodSection'))
const OrderList = lazy(() => import('../Components/Hotel/OrderList'))
const AddFood = lazy(() => import('../Components/Hotel/AddFood'))

const HotelAuth = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path='/food-section' element={<HotelFoodSections/>} />
      <Route path='/hotel-profile-page' element={<HotelProfilePage />} />
      <Route path='/settings' element={<Settings/>} />
      <Route path='/order-page' element={<OrderList />} />
      <Route path='/add-food' element={<AddFood />} />
    </Routes>
  </Suspense>
)

export default HotelAuth